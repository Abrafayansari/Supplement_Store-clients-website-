import Admin from "../classes/Admin.js";
import Customer from "../classes/Customer.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { products } from "./ProductController.js";
import {PrismaClient} from "@prisma/client";

const prisma =new PrismaClient();
const users = [
  new Customer({
    id: "1",
    name: "Rafay",
    email: "rafay@example.com",
    password: await bcrypt.hash("user123", 10) // hashed password
  }),
  new Customer({
    id: "2",
    name: "Ansari",
    email: "ansari@example.com",
    password: await bcrypt.hash("user456", 10)
  }),
  new Admin({
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    password: await bcrypt.hash("admin123", 10)
  })
];
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
      { expiresIn: process.env.JWT_EXPIRY || "1h" }
    );

    // 6. Set JWT in cookie (httpOnly)
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // true in prod (HTTPS)
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

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

export const login = async(req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  // DB-style lookup
  const user = users.find(u => u.email === email);

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
      email:user.email,
      role: user.role
    },
    process.env.JWT_SECRET
    ,
    {
      expiresIn: process.env.JWT_EXPIRY
    }
  );
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "strict",
    maxAge: 60 * 60 * 1000
  });

 return res.status(200).json({
    message: "Login successful",
    token
  });
};


export const addToCart = (req, res) => {
  const userId = req.user.id; // from authenticate middleware
  const { productid, quantity } = req.body;

  // 1. Retrieve user
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });
const product=products.find((i)=>i.id===productid);
if (!product) return res.status(404).json({ message: "Product not found" });

  // 2. Add to cart
  user.addToCart(productid, quantity); // using your Customer method

  // 3. Respond
  res.json({
    message: "Product added to cart",
    user: user
  });
};

export const addtowhislist=(req,res)=>{
 const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
const id=req.body.productid
  const product = products.find(p => p.id ===id );
  if (!product) return res.status(404).json({ message: "Product not found" });

  user.addToWishlist(id);

  res.json({
    message: "Added to wishlist",
    wishlist: user.wishlist
  });

}

export const check =(req,res)=>{
    return res.send("success");
}

export const logout=(req,res)=>{
res.cookie("access_token", "", {
  httpOnly: true,
  expires: new Date(0), // Set expiration in the past
  sameSite: "strict"
});
res.status(200).send("Logout successful");

}