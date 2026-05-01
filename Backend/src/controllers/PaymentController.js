import Stripe from 'stripe';
import { prisma } from '../config/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (order.paymentMethod !== 'ONLINE') {
      return res.status(400).json({ error: 'Order is not an online payment order' });
    }

    if (order.stripePaymentIntentId) {
      const existing = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
      return res.status(200).json({ clientSecret: existing.client_secret });
    }

    // Stripe expects amount in pence (smallest unit) for GBP
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'gbp',
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('createPaymentIntent error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  // Acknowledge immediately so Stripe doesn't retry
  res.status(200).json({ received: true });

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const order = await prisma.order.findFirst({
        where: { stripePaymentIntentId: paymentIntent.id },
        include: { items: true },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'PAID' },
        });

        for (const item of order.items) {
          if (item.variantId) {
            await prisma.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            });
          }
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      await prisma.order.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { paymentStatus: 'FAILED' },
      });
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
  }
};
