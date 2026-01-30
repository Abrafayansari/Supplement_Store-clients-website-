import { prisma } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

// Create a new Order with Order Items
export const createOrder = async (req, res) => {
  try {
    let { userId, addressId, items, paymentMethod, receipt } = req.body;

    // Parse items if they come as a JSON string (for multipart/form-data)
    if (typeof items === 'string') {
      try {
        items = JSON.parse(items);
      } catch (e) {
        return res.status(400).json({ error: "Invalid items format" });
      }
    }

    // 1. Validate input
    if (!userId || !addressId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Missing required fields: userId, addressId, items"
      });
    }

    // 2. Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Verify address exists
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    // 4. Verify all products exist and calculate total
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      });
      if (!product) {
        return res.status(404).json({
          error: `Product with ID ${item.productId} not found`
        });
      }

      let price = product.price;
      let stock = product.stock;

      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (!variant) {
          return res.status(404).json({ error: `Variant ${item.variantId} not found for product ${product.name}` });
        }
        price = variant.price;
        stock = variant.stock;
      }

      if (stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for product ${product.name}${item.variantId ? ` (Variant: ${product.variants.find(v => v.id === item.variantId).size})` : ''}`
        });
      }

      const itemPrice = price * item.quantity;
      total += itemPrice;

      orderItemsData.push({
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        price: price,
      });
    }

    // 4.5. Handle Receipt Upload to Cloudinary
    let receiptUrl = receipt;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "receipts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        ).end(req.file.buffer);
      });
      receiptUrl = uploadResult;
    } else if (receipt && receipt.startsWith("data:image")) {
      // Handle case where it might be sent as base64 in body
      const uploadResult = await cloudinary.uploader.upload(receipt, {
        folder: "receipts"
      });
      receiptUrl = uploadResult.secure_url;
    }

    // 5. Create Order with OrderItems (transaction)
    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        total: Math.round(total), // Ensure integer
        paymentMethod: paymentMethod || 'COD',
        paymentStatus: paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING',
        receipt: receiptUrl,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        adress: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // 6. Update product and variant stock
    for (const item of items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 7. Create notification for admin
    await prisma.notification.create({
      data: {
        type: "NEW_ORDER",
        title: "New Order Received",
        message: `New order #${order.id.slice(0, 8)} from ${user.name} for Rs. ${total}`,
        orderId: order.id,
      },
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Create a new Address
export const createAddress = async (req, res) => {
  try {
    const { userId, fullName, phone, street, city, state, zipCode, country } = req.body;

    if (!userId || !fullName || !phone || !street || !city || !state || !zipCode || !country) {
      return res.status(400).json({
        error: "Missing required fields: userId, fullName, phone, street, city, state, zipCode, country"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        fullName,
        phone,
        street,
        city,
        state,
        zipCode,
        country,
      },
    });

    return res.status(201).json({
      message: "Address created successfully",
      address,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Update existing Address
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, street, city, state, zipCode, country } = req.body;

    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!existingAddress) {
      return res.status(404).json({ error: "Address not found" });
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: {
        fullName: fullName || existingAddress.fullName,
        phone: phone || existingAddress.phone,
        street: street || existingAddress.street,
        city: city || existingAddress.city,
        state: state || existingAddress.state,
        zipCode: zipCode || existingAddress.zipCode,
        country: country || existingAddress.country,
      },
    });

    return res.status(200).json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Get all addresses for a user
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ addresses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        adress: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        adress: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch all orders" });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        adress: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update order status" });
  }
};
