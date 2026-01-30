import express from "express"
import { addToCart, addToWishlist, check, clearCart, deleteCartItem, getProfile, getWishlist, giveReview, isWishlisted, login, logout, removeFromWishlist, showcart, signUp, updateCart, updateProfile, forgotPassword, resetPassword } from "../controllers/UserController.js"
import { createAddress, createOrder, getAllOrders, getUserAddresses, getUserOrders, updateAddress, updateOrderStatus } from "../controllers/OrderController.js";
import { authenticate } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/authorization.js";
import { createProduct, getallproducts, getCategories, uploadbulkproducts, getProductById, updateProduct, deleteProduct } from "../controllers/ProductController.js";
import upload from "../middlewares/uploads.js";
import { getAdminStats } from "../controllers/AdminController.js";
import { getNotifications, getUnreadCount, markAsReadAndDelete, deleteAllNotifications } from "../controllers/NotificationController.js";
import { getBanners, createBanner, deleteBanner } from "../controllers/BannerController.js";


export const router = express.Router();

router.get("/check", authenticate, check);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
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
router.put("/product/:id", authenticate, adminOnly, upload.array("images", 5), updateProduct);
router.delete("/product/:id", authenticate, adminOnly, deleteProduct);
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
router.put("/address/:addressId", authenticate, updateAddress);
router.get("/addresses", authenticate, getUserAddresses);
router.post("/orders", authenticate, upload.single("receipt"), createOrder);
router.get("/orders", authenticate, getUserOrders);
router.get("/getprofile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

// Banner Routes
router.get("/banners", getBanners);
router.post("/admin/banners", authenticate, adminOnly, upload.single("image"), createBanner);
router.delete("/admin/banners/:id", authenticate, adminOnly, deleteBanner);

// Admin Routes
router.get("/admin/stats", authenticate, adminOnly, getAdminStats);
router.get("/admin/orders", authenticate, adminOnly, getAllOrders);
router.put("/admin/orders/:orderId/status", authenticate, adminOnly, updateOrderStatus);

// Admin Notification Routes
router.get("/admin/notifications", authenticate, adminOnly, getNotifications);
router.get("/admin/notifications/unread-count", authenticate, adminOnly, getUnreadCount);
router.delete("/admin/notifications/:notificationId", authenticate, adminOnly, markAsReadAndDelete);
router.delete("/admin/notifications", authenticate, adminOnly, deleteAllNotifications);
