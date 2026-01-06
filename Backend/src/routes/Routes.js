import express from "express"
import { check, login, signUp } from "../controllers/UserController.js"


export const router=express.Router();

router.get("/check",check);
router.post("/signup",signUp);
router.post("/login",login);
