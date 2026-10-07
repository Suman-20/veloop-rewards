import express from "express";

import {
  registerUser,
  loginUser,
  sendOTP,
  verifyOTP,
  googleLogin
} from "../controllers/authController.js";

const router = express.Router();


// Register
router.post("/register", registerUser);


// Login
router.post("/login", loginUser);


// Send OTP
router.post("/send-otp", sendOTP);


// Verify OTP
router.post("/verify-otp", verifyOTP);

// Google Login
router.post("/google", googleLogin);


export default router;