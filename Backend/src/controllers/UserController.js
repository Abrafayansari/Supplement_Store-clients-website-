import Admin from "../classes/Admin.js";
import Customer from "../classes/Customer.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { prisma } from "../config/db.js";
import Product from "../classes/Product.js";

dotenv.config()

/////signup
export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user in DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // 5. Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    // 6. Set JWT in cookie (httpOnly)
    // res.cookie("access_token", token, {
    //   httpOnly: true,
    //   secure: false, // true in prod (HTTPS)
    //   sameSite: "none",
    //   maxAge: 60 * 60 * 1000, // 1 hour
    //    path: "/",
    // });

    // 7. Respond
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  // DB-style lookup
  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  /////jwt
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET
    ,
    {
      expiresIn: process.env.JWT_EXPIRY
    }
  );
  // res.cookie("access_token", token, {
  //   httpOnly: true,
  //   secure: false, // true in production (HTTPS)
  //   sameSite: "none",
  //   maxAge: 60 * 60 * 1000,
  //    path: "/",
  // });

  return res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email, role: user.role
    },
    token
  });
};


export const addToCart = async (req, res) => {
  console.log("Cookies:", req.cookies);
  console.log("Headers:", req.headers.cookie);
  console.log("User:", req.user)
  try {
    const userid = req.user.userId;
    const { productId, quantity } = req.body;

    const qty = parseInt(quantity)
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid product or quantity" });
    }

    // 1. Check product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < qty) {
      return res.status(400).json({ error: "Insufficient stock" });
    }
    console.log(userid)

    // 2. Check if already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: userid,
          productId: productId,
        },
      },
    });
    let cartItem;

    if (existingItem) {
      // 3a. Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + qty,
        },
      });
    } else {
      // 3b. Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: userid,
          productId: productId,
          quantity: qty,
          price: product.price,
        },
      });
    }

    return res.status(200).json({
      message: "Product added to cart",
      cartItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export const addtowhislist = async (req, res) => {
  try {


    const userId = req.user.userId;
    const productId = req.body.productId
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const exist = await prisma.wishlistItem.findUnique({
      where:
      {
        userId_productId: {
          userId: userId,
          productId: productId
        }
      }
    })

    if (exist) {
      return res.status(400).json({ message: "Product already in wishlist" })
    }

    await prisma.wishlistItem.create({
      data: {
        userId: userId,
        productId: productId
      }
    })

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: userId },
      include: { product: true }
    })

    res.json({

      message: "Added to wishlist",
      wishlist: wishlist
    });
  } catch (error) {
    console.log(error.message)
    res.sendStatus(500).json({ message: "Internal server error" });
  }

}

export const giveReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, rating, comment } = req.body;

    if (!productId || rating === undefined) {
      return res.status(400).json({ message: "Product ID and rating are required" });
    }

    const parsedRating = Number(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: parsedRating,
        comment,
      },
    });

    const stats = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: stats._avg.rating,
        reviewCount: stats._count.rating,
      },
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const check = (req, res) => {
  return res.send("success", req.cookies);
}

export const logout = (req, res) => {
  res.cookie("access_token", "", {
    httpOnly: true,
    expires: new Date(0), // Set expiration in the past
    sameSite: "strict"
  });
  res.status(200).send("Logout successful");

}

export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    if (!productId || quantity == null) {
      return res.status(400).json({ message: "productId and quantity required" })
    }

    // quantity <= 0 → REMOVE item
    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      })

      return res.status(200).json({ message: "Item removed from cart" })
    }

    // Ensure item exists
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" })
    }

    // Update quantity
    await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      data: {
        quantity: Number(quantity),
      }
    })

    res.status(200).json({ message: "Cart updated successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    res.status(200).json({ message: "Item removed from cart" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to remove item" })
  }
}


export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId
      }
    })

    res.status(200).json({ message: "Cart cleared successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to clear cart" })
  }
}


export const showcart = async (req, res) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId
      },
      include: {
        product: true
      }
    })

    res.status(200).json({ cartItems })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to show cart" })
  }
}