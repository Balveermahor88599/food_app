import express from "express";
import { signUp, signIn, signOut, forgotPassword, resetPassword } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword);
export default router;
