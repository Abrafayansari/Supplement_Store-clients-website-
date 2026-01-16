import { prisma } from "../config/db.js";

// Create a new Order with Order Items
export const createOrder = async (req, res) => {
  try {
    const { userId, addressId,  items } = req.body;

    // 1. Validate input
    if (!userId || !addressId || !items || items.length === 0) {
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
      });
      if (!product) {
        return res.status(404).json({ 
          error: `Product with ID ${item.productId} not found` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for product ${product.name}` 
        });
      }

      const itemPrice = product.price * item.quantity;
      total += itemPrice;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 5. Create Order with OrderItems (transaction)
    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        total: Math.round(total), // Ensure integer
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
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

    // 6. Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

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

    // 1. Validate input
    if (!userId || !fullName || !phone || !street || !city || !state || !zipCode || !country) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, fullName, phone, street, city, state, zipCode, country" 
      });
    }

    // 2. Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Check if address already exists for this user (since it has @unique constraint)
    const existingAddress = await prisma.address.findUnique({
      where: { userId },
    });
    if (existingAddress) {
      return res.status(409).json({ 
        error: "Address already exists for this user. Update existing address instead." 
      });
    }

    // 4. Create address
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
    const { userId } = req.params;
    const { fullName, phone, street, city, state, zipCode, country } = req.body;

    // 1. Verify address exists
    const existingAddress = await prisma.address.findUnique({
      where: { userId },
    });
    if (!existingAddress) {
      return res.status(404).json({ error: "Address not found for this user" });
    }

    // 2. Update address
    const address = await prisma.address.update({
      where: { userId },
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