import express from "express";
import cors from "cors";
import { router } from "./routes/Routes.js"
import cookieParser from "cookie-parser"; // << here

// import productRoutes from "./routes/product.routes.js";

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://www.nexussupplement.com',
    // 'https://nuve-life-supplements.vercel.app',
    // 'https://supplement-store-clients-website-zeta.vercel.app', 
    // 'https://supplement-store-clients-website.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));
app.use(cookieParser());

app.use(express.json());
// Middlewares
app.use("/uploads", express.static("uploads"));



app.use("/api", router)
// Routes
// app.use("/api/products", productRoutes);

export default app;
