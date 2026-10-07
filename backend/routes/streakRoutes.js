import express from "express";

import { getStreak,claimReward } from "../controllers/streakController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Get current user's streak
router.get("/", authMiddleware, getStreak);

// Claim reward for the current day
router.post("/claim", authMiddleware, claimReward); 


export default router;