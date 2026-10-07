import mongoose from "mongoose";

const streakSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentDay: {
      type: Number,
      default: 1,
      min: 1,
      max: 7,
    },

    lastClaimAt: {
      type: Date,
      default: null,
    },

    nextClaimAt: {
      type: Date,
      default: null,
    },

    completedDays: {
      type: [Number],
      default: [],
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Streak = mongoose.model("Streak", streakSchema);

export default Streak;