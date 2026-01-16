import express from "express";
import cors from "cors";
import bodyparser from "express"
import {router} from "./routes/Routes.js"
import cookieParser from "cookie-parser"; // << here

// import productRoutes from "./routes/product.routes.js";

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());

app.use(express.json());
// Middlewares
app.use("/uploads", express.static("uploads"));



app.use("/api",router)
// Routes
// app.use("/api/products", productRoutes);

export default app;
