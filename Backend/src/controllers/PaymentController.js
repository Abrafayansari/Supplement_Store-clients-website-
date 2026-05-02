import Stripe from 'stripe';
import { prisma } from '../config/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  console.log('[createPaymentIntent] invoked — body:', JSON.stringify(req.body));
  console.log('[createPaymentIntent] req.user:', JSON.stringify(req.user));
  console.log('[createPaymentIntent] STRIPE_SECRET_KEY set:', !!process.env.STRIPE_SECRET_KEY);

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
      console.log('[createPaymentIntent] order not found for id:', orderId);
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('[createPaymentIntent] order found:', {
      id: order.id,
      userId: order.userId,
      total: order.total,
      paymentMethod: order.paymentMethod,
      stripePaymentIntentId: order.stripePaymentIntentId ?? '(field missing from generated client)',
    });
    console.log('[createPaymentIntent] auth check — order.userId:', order.userId, '| req.user.userId:', req.user?.userId);

    if (order.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (order.paymentMethod !== 'ONLINE') {
      return res.status(400).json({ error: 'Order is not an online payment order' });
    }

    if (order.stripePaymentIntentId) {
      console.log('[createPaymentIntent] reusing existing intent:', order.stripePaymentIntentId);
      const existing = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
      return res.status(200).json({ clientSecret: existing.client_secret });
    }

    const amountInSmallestUnit = Math.round(order.total * 100);
    console.log('[createPaymentIntent] creating Stripe payment intent — amount:', amountInSmallestUnit, 'currency: gbp');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: 'gbp',
      metadata: { orderId: order.id },
    });

    console.log('[createPaymentIntent] Stripe intent created:', paymentIntent.id, '— saving to DB');

    await prisma.order.update({
      where: { id: orderId },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    console.log('[createPaymentIntent] DB updated — returning clientSecret');
    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('[createPaymentIntent] *** 500 ERROR ***');
    console.error('  name:    ', error.constructor?.name ?? error.name);
    console.error('  message: ', error.message);
    console.error('  stack:   ', error.stack);
    // Prisma-specific fields
    if (error.code)        console.error('  prisma.code:', error.code);
    if (error.meta)        console.error('  prisma.meta:', JSON.stringify(error.meta));
    if (error.clientVersion) console.error('  prisma.clientVersion:', error.clientVersion);
    // Stripe-specific fields
    if (error.type)        console.error('  stripe.type:', error.type);
    if (error.code && error.type) console.error('  stripe.code:', error.code);
    if (error.statusCode)  console.error('  stripe.statusCode:', error.statusCode);
    if (error.raw)         console.error('  stripe.raw:', JSON.stringify(error.raw));
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
