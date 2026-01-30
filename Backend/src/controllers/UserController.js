import Admin from "../classes/Admin.js";
// Trigger restart
import Customer from "../classes/Customer.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { prisma } from "../config/db.js";
import Product from "../classes/Product.js";
import SibApiV3Sdk from "sib-api-v3-sdk";

import crypto from "crypto";
import nodemailer from "nodemailer";

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
        createdAt: user.createdAt,
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
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    token
  });
};


export const addToCart = async (req, res) => {
  try {
    const userid = req.user.userId;
    const { productId, variantId, quantity } = req.body;

    const qty = parseInt(quantity);
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid product or quantity" });
    }

    // 1. Check product and variant
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let price = product.price;
    let stock = product.stock;

    if (variantId) {
      const variant = product.variants.find(v => v.id === variantId);
      if (!variant) {
        return res.status(404).json({ error: "Variant not found" });
      }
      price = variant.price;
      stock = variant.stock;
    }

    if (stock < qty) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // 2. Check if already in cart (with specific variant)
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId: userid,
          productId: productId,
          variantId: variantId || null,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + qty,
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: userid,
          productId: productId,
          variantId: variantId || null,
          quantity: qty,
          price: price,
        },
      });
    }

    return res.status(200).json({
      message: "Product added to cart",
      cartItem,
    });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// controllers/wishlistController.js

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if already in wishlist
    const exists = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } }
    });
    if (exists) return res.status(400).json({ message: "Product already in wishlist" });

    // Add to wishlist
    await prisma.wishlistItem.create({
      data: { userId, productId }
    });

    res.status(201).json({ message: "Added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } }
    });

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Wishlist item not found" });
  }
};

// Check if product is in wishlist
export const isWishlisted = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const exists = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    res.status(200).json({ exists: !!exists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Wishlist check failed" });
  }
};

// Get all wishlist items for user
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true }
    });

    res.status(200).json({ wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};


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
    const { productId, variantId, quantity } = req.body
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
          userId_productId_variantId: {
            userId,
            productId,
            variantId: variantId || null
          }
        }
      })

      return res.status(200).json({ message: "Item removed from cart" })
    }

    // Ensure item exists
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId,
          productId,
          variantId: variantId || null
        }
      }
    })

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" })
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id: cartItem.id },
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
    const { id } = req.params; // Using unique CartItem ID is safer
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    await prisma.cartItem.delete({
      where: {
        id,
        userId
      }
    });

    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove item" });
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
        product: {
          include: {
            variants: true
          }
        },
        variant: true
      }
    })

    res.status(200).json({ cartItems })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to show cart" })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId }
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        addresses: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};


// Forgot Password
// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await prisma.user.findUnique({ where: { email } });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Generate token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetTokenHash = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     const resetTokenExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     await prisma.user.update({
//       where: { email },
//       data: {
//         resetToken: resetTokenHash,
//         resetTokenExpire: resetTokenExpire,
//       },
//     });

//     // Create reset URL
//     // Assuming frontend runs on localhost:5173 or typically configured frontend URL
//     // In production, use env var for frontend URL
//     const frontendUrl =
//       process.env.FRONTEND_URL ||
//       "http://localhost:3000";
//     const resetUrl = `${frontendUrl}/#/reset-password/${resetToken}`;

//     const message = `
//       <h1>You have requested a password reset</h1>
//       <p>Please go to this link to reset your password:</p>
//       <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
//     `;

//     // Send Email
//     console.log({
//       EMAIL_HOST: process.env.EMAIL_HOST,
//       EMAIL_PORT: process.env.EMAIL_PORT,
//       EMAIL_USERNAME: process.env.EMAIL_USERNAME,
//       HAS_PASSWORD: !!process.env.EMAIL_PASSWORD,
//     });

//     const transporter = nodemailer.createTransport({

//       host: process.env.EMAIL_HOST,
//       port: Number(process.env.EMAIL_PORT),
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     await transporter.verify();
//     console.log("SMTP connection OK");


//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM || "noreply@gymstore.com",
//       to: user.email,
//       subject: "Password Reset Request",
//       html: message,
//     });

//     res.status(200).json({ success: true, data: "Email Sent" });
//   } catch (err) {
//     console.error(err);
//     // Clean up on error
//     await prisma.user.update({
//       where: { email },
//       data: { resetToken: null, resetTokenExpire: null },
//     });
//     res.status(500).json({ error: "Email could not be sent" });
//   }
// };

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { email },
      data: { resetToken: resetTokenHash, resetTokenExpire },
    });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/#/reset-password/${resetToken}`;

    // Brevo API setup
    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;
    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    await tranEmailApi.sendTransacEmail({
      sender: { email: process.env.EMAIL_FROM },
      to: [{ email: user.email }],
      subject: "Password Reset Request",
      htmlContent: `
        <h1>Password Reset</h1>
        <p>Click this link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    res.status(200).json({ success: true, data: "Email Sent" });
  } catch (err) {
    console.error(err);
    await prisma.user.update({
      where: { email },
      data: { resetToken: null, resetTokenExpire: null },
    });
    res.status(500).json({ error: "Email could not be sent" });
  }
};

// Reset Password
// export const resetPassword = async (req, res) => {
//   const resetToken = crypto
//     .createHash("sha256")
//     .update(req.params.resetToken)
//     .digest("hex");

//   try {
//     const user = await prisma.user.findFirst({
//       where: {
//         resetToken,
//         resetTokenExpire: {
//           gt: new Date(),
//         },
//       },
//     });

//     if (!user) {
//       return res.status(400).json({ error: "Invalid Token" });
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10);

//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         password: hashedPassword,
//         resetToken: null,
//         resetTokenExpire: null,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       data: "Password Updated Success",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server Error" });
//   }
// };

export const resetPassword = async (req, res) => {
  const resetToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

  try {

























    const user = await prisma.user.findFirst({
      where: { resetToken, resetTokenExpire: { gt: new Date() } },
    });

    if (!user) return res.status(400).json({ error: "Invalid Token" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpire: null },
    });















































    res.status(201).json({ success: true, data: "Password Updated Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
