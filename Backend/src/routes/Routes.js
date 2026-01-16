import express from "express"
import { addToCart, addtowhislist, check, giveReview, login, logout, signUp } from "../controllers/UserController.js"
import { authenticate } from "../middlewares/auth.js";
import {adminOnly} from "../middlewares/authorization.js";
import { createProduct, getallproducts, getCategories, uploadbulkproducts } from "../controllers/ProductController.js";
import upload  from "../middlewares/uploads.js";


export const router=express.Router();

router.get("/check",authenticate,check);
router.post("/signup",signUp);
router.post("/login",login);
router.post("/create-product",authenticate,adminOnly,upload.array("images", 5),createProduct);
router.post("/addtocart",authenticate,addToCart);
router.get("/logout",authenticate,logout);
router.post("/addtowishlist",authenticate,addtowhislist);
router.post("/givereview",authenticate,giveReview);
router.post("/uploadproducts",authenticate,adminOnly,upload.fields([
    { name: "excel", maxCount: 1 },
    { name: "images", maxCount: 1 },
  ]),uploadbulkproducts);

  router.get("/getallproducts",getallproducts);
 router.get("/getcategories",getCategories)

