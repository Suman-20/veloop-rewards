import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Reward from "./models/Reward.js";

dotenv.config();

const rewards = [
  {
    day: 1,
    rewardType: "coin",
    currency: "VES",
    amount: 5,
    title: "Daily Reward",
    description: "Daily streak reward",
    asset: "VEs_Coin.png",
    active: true,
    metadata: {
      rewardLabel: "+5 VEs",
    },
  },

  {
    day: 2,
    rewardType: "coin",
    currency: "VES",
    amount: 10,
    title: "Daily Reward",
    description: "Daily streak reward",
    asset: "VEs_Coin.png",
    active: true,
    metadata: {
      rewardLabel: "+10 VEs",
    },
  },

  {
    day: 3,
    rewardType: "coin",
    currency: "VES",
    amount: 15,
    title: "Daily Reward",
    description: "Daily streak reward",
    asset: "VEs_Coin.png",
    active: true,
    metadata: {
      rewardLabel: "+15 VEs",
    },
  },

  {
    day: 4,
    rewardType: "gift-card",
    currency: "INR",
    amount: 1,
    title: "Amazon Gift Card",
    description: "₹1 Amazon Gift Card",
    asset: "Day-4.png",
    active: true,
    metadata: {
      brand: "Amazon",
      rewardLabel: "₹1",
    },
  },

  {
    day: 5,
    rewardType: "gift-card",
    currency: "INR",
    amount: 2,
    title: "Amazon Gift Card",
    description: "₹2 Amazon Gift Card",
    asset: "Day-5.png",
    active: true,
    metadata: {
      brand: "Amazon",
      rewardLabel: "₹2",
    },
  },

  {
    day: 6,
    rewardType: "coin",
    currency: "VES",
    amount: 30,
    title: "Daily Reward",
    description: "Daily streak reward",
    asset: "VEs_Coin.png",
    active: true,
    metadata: {
      rewardLabel: "+30 VEs",
    },
  },

  {
    day: 7,
    rewardType: "gift-card",
    currency: "INR",
    amount: 5,
    title: "Ultimate Reward",
    description: "₹5 Amazon Gift Card",
    asset: "Day-7.png",
    active: true,
    metadata: {
      brand: "Amazon",
      rewardLabel: "₹5",
      ultimateReward: true,
    },
  },
];

const seedRewards = async () => {
  try {
    await connectDB();

    for (const reward of rewards) {
      await Reward.findOneAndUpdate(
        { day: reward.day },
        reward,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log("✅ Reward data inserted successfully!");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed rewards:", error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedRewards();