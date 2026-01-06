import Admin from "../classes/Admin.js";
import Customer from "../classes/Customer.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
const users=[]
dotenv.config()
export const signUp = async(req, res) => {
  const { id, name, email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // DB-style uniqueness check
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: "Email already registered" });
  }

  let user;
const hashedPassword = await bcrypt.hash(password, 10);
  if (role === "ADMIN") {
    user = new Admin({ id, name, email, password:hashedPassword });
  } else if (role === "CUSTOMER") {
    user = new Customer({ id, name, email, password:hashedPassword });
  } else {
    return res.status(400).json({ error: "Invalid role" });
  }

  users.push(user);

  return res.status(201).json({
    message: "User created successfully",
    user
  });
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

export const check =(req,res)=>{
    return res.send("seccess");
}