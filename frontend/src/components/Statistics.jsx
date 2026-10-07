import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config/api.js";

function Statistics() {
  const [totalRewards, setTotalRewards] = useState(0);
  const [checkedIn, setCheckedIn] = useState(0);
  const [nextReward, setNextReward] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const [streakResponse, rewardsResponse] =
          await Promise.all([
            axios.get(
              `${API_URL}/api/streak`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

            axios.get(
              `${API_URL}/api/rewards`
            ),
          ]);

        const streak = streakResponse.data.streak;
        const rewards = rewardsResponse.data.rewards;

        // Total active rewards
        setTotalRewards(rewards.length);

        // Completed check-ins
        setCheckedIn(
          streak.completedDays?.length || 0
        );

        // Current day's reward
        const currentReward = rewards.find(
          (reward) =>
            reward.day === streak.currentDay
        );

        setNextReward(currentReward || null);
      } catch (error) {
        console.error(
          "Statistics fetch error:",
          error.response?.data || error.message
        );
      }
    };

    fetchStatistics();

    // Refresh statistics after reward claim
    const handleStreakUpdate = () => {
      fetchStatistics();
    };

    window.addEventListener(
      "streakUpdated",
      handleStreakUpdate
    );

    return () => {
      window.removeEventListener(
        "streakUpdated",
        handleStreakUpdate
      );
    };
  }, []);

  // =====================================
  // FORMAT NEXT REWARD
  // =====================================

  const formatNextReward = () => {
    if (!nextReward) {
      return "--";
    }

    if (nextReward.currency === "INR") {
      return `₹${nextReward.amount}`;
    }

    return `+${nextReward.amount} ${nextReward.currency}`;
  };

  return (
    <section className="bg-[#0B1220] px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Statistics Container */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* ================= TOTAL REWARDS ================= */}

          <div className="rounded-2xl border border-purple-400/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:bg-purple-500/[0.06]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-400">
                  Total Rewards
                </p>

                <h3 className="mt-2 text-3xl font-extrabold text-purple-400">
                  {totalRewards}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Available rewards
                </p>

              </div>

              {/* Icon */}

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                🎁
              </div>

            </div>

          </div>

          {/* ================= CHECKED IN ================= */}

          <div className="rounded-2xl border border-emerald-400/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-emerald-500/[0.05]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-400">
                  Checked In
                </p>

                <h3 className="mt-2 text-3xl font-extrabold text-emerald-400">
                  {checkedIn}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Days completed
                </p>

              </div>

              {/* Icon */}

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl">
                ✓
              </div>

            </div>

          </div>

          {/* ================= NEXT REWARD ================= */}

          <div className="rounded-2xl border border-orange-400/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-400/20 hover:bg-orange-500/[0.05]">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-400">
                  Next Reward
                </p>

                <h3 className="mt-2 text-3xl font-extrabold text-orange-400">
                  {formatNextReward()}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Your next reward
                </p>

              </div>

              {/* Icon */}

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-xl">
                🪙
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Statistics;