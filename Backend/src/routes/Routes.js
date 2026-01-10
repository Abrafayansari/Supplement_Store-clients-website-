import express from "express"
import { addToCart, addtowhislist, check, login, logout, signUp } from "../controllers/UserController.js"
import { authenticate } from "../middlewares/auth.js";
import {adminOnly} from "../middlewares/authorization.js";
import { createProduct } from "../controllers/ProductController.js";
import { upload } from "../middlewares/uploads.js";


export const router=express.Router();

router.get("/check",check);
router.post("/signup",signUp);
router.post("/login",login);
router.post("/create-product",authenticate,adminOnly,upload.array("images", 5),createProduct);
router.post("/addtocart",authenticate,addToCart);
router.get("/logout",authenticate,logout);
router.post("/addtowishlist",authenticate,addtowhislist);
