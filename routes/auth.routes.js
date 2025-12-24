import express from "express";
import { signUp, signIn, signOut, forgotPassword, resetPassword, googleSignIn } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword);
router.post("/google-login", googleSignIn);
export default router;
