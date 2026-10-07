import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 7,
    },

    rewardType: {
      type: String,
      enum: ["coin", "gift-card"],
      required: true,
    },

    currency: {
      type: String,
      default: "VES",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    asset: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Reward = mongoose.model("Reward", rewardSchema);

export default Reward;