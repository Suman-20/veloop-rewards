import { useEffect, useState } from "react";
import axios from "axios";
import VEsCoin from "../assets/VEs_Coin.png";
import Day4 from "../assets/Day-4.png";
import Day5 from "../assets/Day-5.png";
import Day7 from "../assets/Day-7.png";

const initialStreakData = {
  currentStreak: 0,
  currentDay: 1,
  completedDays: [],
  nextClaimAt: null,
  lastClaimAt: null,
  isCompleted: false,
  days: [],
};

function StreakCard() {
  const [streakData, setStreakData] = useState(initialStreakData);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const [streakResponse, rewardsResponse] = await Promise.all([
          axios.get("http://localhost:2005/api/streak", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          axios.get("http://localhost:2005/api/rewards"),
        ]);

        const streak = streakResponse.data.streak;
        const rewards = rewardsResponse.data.rewards;

        const days = rewards.map((reward) => {
          let status = "locked";

          if (streak.completedDays?.includes(reward.day)) {
            status = "claimed";
          } else if (reward.day === streak.currentDay) {
            status = "available";
          }

          return {
            day: reward.day,
            reward: reward.amount,
            currency: reward.currency,
            status,
            rewardType: reward.rewardType,
            title: reward.title,
            description: reward.description,
            asset: reward.asset,
          };
        });

        setStreakData({
          ...streak,
          days,
        });
      } catch (error) {
        console.error(
          "Fetch streak data error:",
          error.response?.data || error.message,
        );
      }
    };

    // First load
    fetchStreakData();

    // Refresh after reward claim
    window.addEventListener("streakUpdated", fetchStreakData);

    return () => {
      window.removeEventListener("streakUpdated", fetchStreakData);
    };
  }, []);

  // =====================================
  // BACKEND BASED COUNTDOWN
  // =====================================

  useEffect(() => {
    const calculateRemaining = () => {
      if (!streakData.nextClaimAt) {
        setRemaining(0);
        return;
      }

      const target = new Date(streakData.nextClaimAt).getTime();

      const now = Date.now();

      const difference = Math.max(target - now, 0);

      setRemaining(difference);
    };

    calculateRemaining();

    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [streakData.nextClaimAt]);

  // =====================================
  // TIME FORMAT
  // =====================================

  const totalSeconds = Math.floor(remaining / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  const formatTime = (value) => String(value).padStart(2, "0");

  // =====================================
  // REWARD FORMAT
  // =====================================

  const formatReward = (item) => {
    if (!item) return "--";

    if (item.currency === "INR") {
      return `₹${item.reward}`;
    }

    return `+${item.reward} ${item.currency}`;
  };

  // =====================================
  // NEXT REWARD
  // =====================================

  const nextReward = streakData.days.find(
    (item) => item.day === streakData.currentDay,
  );

  // =====================================
  // STATUS STYLE
  // =====================================

  const getDayStyle = (status) => {
    if (status === "claimed") {
      return {
        wrapper: "border-emerald-400/20 bg-emerald-500/[0.07]",
        circle: "bg-emerald-500 text-white",
        reward: "text-emerald-300",
      };
    }

    if (status === "available") {
      return {
        wrapper:
          "border-purple-400/40 bg-purple-500/[0.10] shadow-lg shadow-purple-950/20",
        circle: "bg-purple-600 text-white ring-4 ring-purple-500/10",
        reward: "text-purple-300",
      };
    }

    return {
      wrapper: "border-white/[0.07] bg-white/[0.025]",
      circle: "bg-white/[0.06] text-slate-500",
      reward: "text-slate-500",
    };
  };

  const getRewardImage = (item) => {
    if (!item) return null;

    if (item.asset === "Day-4.png") return Day4;
    if (item.asset === "Day-5.png") return Day5;
    if (item.asset === "Day-7.png") return Day7;

    // Day 1, 2, 3, 6 → VEs Coins
    if (item.rewardType === "coin") return VEsCoin;

    return null;
  };

  return (
    <section
      id="streak"
      className="relative overflow-hidden bg-[#0B1220] px-4 py-16 text-white sm:px-6 lg:px-8"
    >
      {/* Background */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-600/[0.07] blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-indigo-600/[0.06] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}

        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/[0.08] px-4 py-2">
            <span>🔥</span>

            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Daily Streak
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Keep Your Streak Alive
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Check in every day and unlock bigger rewards as your streak grows.
          </p>
        </div>

        {/* Main Streak Card */}

        <div className="mx-auto mt-10 max-w-5xl">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#101827] shadow-2xl shadow-black/20">
            {/* Top Area */}

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              {/* Current Streak */}

              <div className="relative overflow-hidden rounded-2xl border border-purple-400/10 bg-purple-500/[0.05] p-6">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-purple-500/10 blur-2xl" />

                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Current Streak
                  </p>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-3xl">
                      🔥
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold text-white">
                          {streakData.currentStreak}
                        </span>

                        <span className="text-sm font-semibold text-slate-500">
                          {streakData.currentStreak === 1 ? "day" : "days"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-purple-300">
                        Keep going!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Reward */}

              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Next Reward
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Complete the next check-in
                    </p>
                  </div>

                  <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                    Day {streakData.currentDay}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-extrabold text-white">
                      {nextReward
                        ? nextReward.currency === "INR"
                          ? `₹${nextReward.reward}`
                          : `+${nextReward.reward}`
                        : "--"}
                    </p>

                    <p className="mt-1 text-xs font-bold text-purple-400">
                      {nextReward?.currency || ""}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">Unlocks in</p>

                    <p className="mt-1 font-mono text-lg font-bold text-slate-300">
                      {formatTime(hours)}:{formatTime(minutes)}:
                      {formatTime(seconds)}
                    </p>
                  </div>
                </div>

                {/* Progress */}

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-[10px] font-semibold text-slate-500">
                    <span>Day 1</span>

                    <span>Day 7</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-purple-500 transition-all duration-500"
                      style={{
                        width: `${
                          (Math.min(streakData.currentStreak, 7) / 7) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 7 Day Reward Tracker */}

            <div className="border-t border-white/[0.07] px-6 py-7 sm:px-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    7-Day Reward Journey
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Stay consistent to unlock every reward.
                  </p>
                </div>

                <span className="text-xs font-semibold text-slate-500">
                  {streakData.completedDays?.length || 0}/7 completed
                </span>
              </div>

              {/* Days */}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {streakData.days.map((item) => {
                  const style = getDayStyle(item.status);

                  return (
                    <div
                      key={item.day}
                      className={`relative rounded-2xl border p-4 transition duration-300 hover:-translate-y-1 ${style.wrapper}`}
                    >
                      {/* Current indicator */}

                      {item.status === "available" && (
                        <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-purple-400" />
                      )}

                      {/* Day Circle */}

                      {/* <div className="flex justify-center">

                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold ${style.circle}`}
                        >
                          {item.day}
                        </div>

                      </div> */}

                      {/* Day */}
                      {/* 
                      <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Day {item.day}
                      </p> */}

                      {/* Day Circle */}

                      <div className="flex justify-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold ${style.circle}`}
                        >
                          {item.day}
                        </div>
                      </div>

                      {/* Reward Image */}

                      <div className="mt-4 flex h-16 items-center justify-center">
                        {getRewardImage(item) && (
                          <img
                            src={getRewardImage(item)}
                            alt={`Day ${item.day} reward`}
                            className={`object-contain drop-shadow-lg ${
                              item.rewardType === "gift-card"
                                ? "h-14 w-20"
                                : "h-14 w-14"
                            }`}
                          />
                        )}
                      </div>

                      {/* Day */}

                      <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Day {item.day}
                      </p>


                      

                      {/* Reward */}

                      <p
                        className={`mt-2 text-center text-sm font-extrabold ${style.reward}`}
                      >
                        {formatReward(item)}
                      </p>

                      {/* Status */}

                      <div className="mt-3 text-center">
                        {item.status === "claimed" && (
                          <span className="text-[10px] font-bold text-emerald-400">
                            ✓ Claimed
                          </span>
                        )}

                        {item.status === "available" && (
                          <span className="text-[10px] font-bold text-purple-300">
                            ✨ Available
                          </span>
                        )}

                        {item.status === "locked" && (
                          <span className="text-[10px] font-bold text-slate-600">
                            🔒 Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Countdown Footer */}

            <div className="border-t border-white/[0.07] bg-black/[0.12] px-6 py-5 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                    ⏳
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-300">
                      Next reward unlock
                    </p>

                    <p className="mt-1 text-[11px] text-slate-600">
                      Reward eligibility is verified by the backend.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2">
                  {remaining > 0 ? (
                    <p className="font-mono text-sm font-bold tracking-wider text-purple-300">
                      {formatTime(hours)}:{formatTime(minutes)}:
                      {formatTime(seconds)}
                    </p>
                  ) : (
                    <p className="text-sm font-bold text-purple-300">
                      Reward Available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote */}

        <p className="mt-6 text-center text-[11px] text-slate-600">
          Streak status, reward values and claim eligibility are determined by
          the system.
        </p>
      </div>
    </section>
  );
}

export default StreakCard;
