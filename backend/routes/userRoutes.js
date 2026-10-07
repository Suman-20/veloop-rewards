import express from "express";

import { getProfile,getWallet,getTransactions } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.get("/wallet", authMiddleware, getWallet);
router.get("/transactions", authMiddleware, getTransactions);
export default router;