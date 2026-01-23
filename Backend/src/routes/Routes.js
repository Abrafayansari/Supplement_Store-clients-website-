import express from "express"
import { addToCart, addToWishlist, check, clearCart, deleteCartItem, getProfile, getWishlist, giveReview, isWishlisted, login, logout, removeFromWishlist, showcart, signUp, updateCart, updateProfile } from "../controllers/UserController.js"
import { createAddress, createOrder, getUserOrders, updateAddress } from "../controllers/OrderController.js";
import { authenticate } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/authorization.js";
import { createProduct, getallproducts, getCategories, uploadbulkproducts, getProductById } from "../controllers/ProductController.js";
import upload from "../middlewares/uploads.js";


export const router = express.Router();

router.get("/check", authenticate, check);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/create-product", authenticate, adminOnly, upload.array("images", 5), createProduct);
router.post("/addtocart", authenticate, addToCart);
router.get("/logout", authenticate, logout);
router.post("/givereview", authenticate, giveReview);
router.post("/uploadproducts", authenticate, adminOnly, upload.fields([
  { name: "excel", maxCount: 1 },
  { name: "images", maxCount: 1 },
]), uploadbulkproducts);

router.get("/getallproducts", getallproducts);
router.get("/product/:id", getProductById);
router.get("/getcategories", getCategories)
router.post("/updatecart", authenticate, updateCart);
router.delete("/removecartitem", authenticate, deleteCartItem)
router.delete("/clearcart", authenticate, clearCart)
router.get("/showcart", authenticate, showcart)
router.post("/wishlist", authenticate, addToWishlist);
router.delete("/wishlist/:productId", authenticate, removeFromWishlist)
router.get("/wishlist/exists/:productId", authenticate, isWishlisted);
router.get("/wishlist", authenticate, getWishlist);
router.post("/address", authenticate, createAddress);
router.put("/address/:userId", authenticate, updateAddress);
router.post("/orders", authenticate, createOrder);
router.get("/orders", authenticate, getUserOrders);
router.get("/getprofile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);