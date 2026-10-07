import Reward from "../models/Reward.js";

export const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ active: true })
      .sort({ day: 1 })
      .select("-__v");

    return res.status(200).json({
      success: true,
      count: rewards.length,
      rewards,
    });
  } catch (error) {
    console.error("Get rewards error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rewards",
    });
  }
};