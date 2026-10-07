

import Streak from "../models/Streak.js";
import Reward from "../models/Reward.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

// =====================================
// TIME CONFIGURATION
// =====================================

const CLAIM_WAIT_TIME = 24 * 60 * 60 * 1000; // 24 hours
const CLAIM_WINDOW = 24 * 60 * 60 * 1000; // 24 hours claim window


// =====================================
// CHECK MISSED DAY & RESET STREAK
// =====================================

const checkAndResetMissedStreak = async (streak) => {
  // User has never claimed anything
  if (!streak.lastClaimAt) {
    return streak;
  }

  // 7-day streak already completed
  if (streak.isCompleted) {
    return streak;
  }

  const now = new Date();

  // Next day becomes available after 24 hours
  const nextClaimTime = new Date(
    streak.lastClaimAt.getTime() + CLAIM_WAIT_TIME
  );

  // User gets another 24 hours to claim that next day
  const claimDeadline = new Date(
    nextClaimTime.getTime() + CLAIM_WINDOW
  );

  // =====================================
  // MISSED DAY DETECTED
  // =====================================

  if (now >= claimDeadline) {
    console.log(
      `Missed streak detected. Resetting streak for user: ${streak.user}`
    );

    streak.currentStreak = 0;
    streak.currentDay = 1;
    streak.completedDays = [];
    streak.lastClaimAt = null;
    streak.nextClaimAt = null;
    streak.isCompleted = false;

    await streak.save();
  }

  return streak;
};


// =====================================
// GET USER STREAK
// =====================================

export const getStreak = async (req, res) => {
  try {
    // =====================================
    // 1. FIND USER STREAK
    // =====================================

    let streak = await Streak.findOne({
      user: req.user.id,
    });

    // =====================================
    // 2. CREATE STREAK IF NOT EXISTS
    // =====================================

    if (!streak) {
      streak = await Streak.create({
        user: req.user.id,
        currentStreak: 0,
        currentDay: 1,
        completedDays: [],
        lastClaimAt: null,
        nextClaimAt: null,
        isCompleted: false,
      });
    }

    // =====================================
    // 3. CHECK MISSED DAY
    // =====================================

    streak = await checkAndResetMissedStreak(streak);

    // =====================================
    // 4. RETURN STREAK
    // =====================================

    return res.status(200).json({
      success: true,

      streak: {
        id: streak._id,
        currentStreak: streak.currentStreak,
        currentDay: streak.currentDay,
        completedDays: streak.completedDays,
        lastClaimAt: streak.lastClaimAt,
        nextClaimAt: streak.nextClaimAt,
        isCompleted: streak.isCompleted,
      },
    });
  } catch (error) {
    console.error("Get streak error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch streak",
    });
  }
};


// =====================================
// CLAIM REWARD
// =====================================

export const claimReward = async (req, res) => {
  try {
    const userId = req.user.id;

    // =====================================
    // 1. FIND USER STREAK
    // =====================================

    let streak = await Streak.findOne({
      user: userId,
    });

    if (!streak) {
      return res.status(404).json({
        success: false,
        message: "Streak not found",
      });
    }

    // =====================================
    // 2. CHECK MISSED DAY & RESET
    // =====================================

    streak = await checkAndResetMissedStreak(streak);

    // =====================================
    // 3. CHECK 7-DAY COMPLETION
    // =====================================

    if (streak.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "7-day streak already completed.",
      });
    }

    // =====================================
    // 4. CHECK CLAIM WAITING PERIOD
    // =====================================

    if (streak.lastClaimAt) {
      const now = new Date();

      const nextClaimTime = new Date(
        streak.lastClaimAt.getTime() + CLAIM_WAIT_TIME
      );

      // Still waiting for next claim
      if (now < nextClaimTime) {
        return res.status(400).json({
          success: false,
          message:
            "Reward already claimed. Please wait until the next claim time.",
          nextClaimAt: nextClaimTime,
        });
      }
    }

    // =====================================
    // 5. GET CURRENT REWARD FROM DATABASE
    // =====================================

    const reward = await Reward.findOne({
      day: streak.currentDay,
      active: true,
    });

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Reward not found for current streak day",
      });
    }

    // =====================================
    // 6. FIND OR CREATE WALLET
    // =====================================

    let wallet = await Wallet.findOne({
      user: userId,
    });

    if (!wallet) {
      wallet = await Wallet.create({
        user: userId,
        vesBalance: 0,
        inrBalance: 0,
      });
    }

    // =====================================
    // 7. GET BALANCE BEFORE REWARD
    // =====================================

    const balanceBefore =
      reward.currency === "VES"
        ? wallet.vesBalance
        : wallet.inrBalance;

    // =====================================
    // 8. UPDATE WALLET
    // =====================================

    if (reward.currency === "VES") {
      wallet.vesBalance += reward.amount;
    } else if (reward.currency === "INR") {
      wallet.inrBalance += reward.amount;
    }

    await wallet.save();

    // =====================================
    // 9. GET BALANCE AFTER REWARD
    // =====================================

    const balanceAfter =
      reward.currency === "VES"
        ? wallet.vesBalance
        : wallet.inrBalance;

    // =====================================
    // 10. CREATE TRANSACTION
    // =====================================

    const transaction = await Transaction.create({
      transactionId: `STREAK-${userId}-${Date.now()}`,
      user: userId,
      rewardType: reward.rewardType,
      amount: reward.amount,
      currency: reward.currency,
      source: "daily-streak",
      streakDay: reward.day,
      referenceId: streak._id.toString(),
      balanceBefore,
      balanceAfter,
      status: "success",
    });

    // =====================================
    // 11. UPDATE STREAK
    // =====================================

    const now = new Date();

    // Save last claim time
    streak.lastClaimAt = now;

    // Next claim becomes available after 24 hours
    streak.nextClaimAt = new Date(
      now.getTime() + CLAIM_WAIT_TIME
    );

    // =====================================
    // ADD CURRENT DAY TO COMPLETED DAYS
    // =====================================

    if (!streak.completedDays.includes(streak.currentDay)) {
      streak.completedDays.push(streak.currentDay);
    }

    // =====================================
    // INCREASE CURRENT STREAK
    // =====================================

    streak.currentStreak += 1;

    // =====================================
    // MOVE TO NEXT DAY
    // =====================================

    if (streak.currentDay < 7) {
      streak.currentDay += 1;
    } else {
      // Day 7 completed
      streak.isCompleted = true;
    }

    await streak.save();

    // =====================================
    // 12. SUCCESS RESPONSE
    // =====================================

    return res.status(200).json({
      success: true,

      message: "Reward claimed successfully",

      // =====================================
      // WALLET
      // =====================================

      wallet: {
        vesBalance: wallet.vesBalance,
        inrBalance: wallet.inrBalance,
      },

      // =====================================
      // TRANSACTION
      // =====================================

      transaction: {
        transactionId: transaction.transactionId,
        rewardType: transaction.rewardType,
        amount: transaction.amount,
        currency: transaction.currency,
        streakDay: transaction.streakDay,
        balanceBefore: transaction.balanceBefore,
        balanceAfter: transaction.balanceAfter,
        status: transaction.status,
      },

      // =====================================
      // REWARD
      // =====================================

      reward: {
        day: reward.day,
        rewardType: reward.rewardType,
        currency: reward.currency,
        amount: reward.amount,
        title: reward.title,
        description: reward.description,
        asset: reward.asset,
      },

      // =====================================
      // STREAK
      // =====================================

      streak: {
        currentStreak: streak.currentStreak,
        currentDay: streak.currentDay,
        completedDays: streak.completedDays,
        lastClaimAt: streak.lastClaimAt,
        nextClaimAt: streak.nextClaimAt,
        isCompleted: streak.isCompleted,
      },
    });
  } catch (error) {
    console.error("Claim reward error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to claim reward",
    });
  }
};