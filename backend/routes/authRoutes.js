import express from "express";

import {
  registerUser,
  loginUser,
  
  googleLogin
} from "../controllers/authController.js";

const router = express.Router();


// Register
router.post("/register", registerUser);


// Login
router.post("/login", loginUser);

// Google Login
router.post("/google", googleLogin);


export default router;