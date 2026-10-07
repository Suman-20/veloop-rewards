import { useEffect, useState } from "react";
import axios from "axios";
import Day7Reward from "../assets/Day-7.png";

function UltimateReward() {
  const [streak, setStreak] = useState(null);
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH STREAK + DAY 7 REWARD
  // =====================================================

  useEffect(() => {
    const fetchUltimateReward = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const [streakResponse, rewardsResponse] =
          await Promise.all([
            axios.get(
              "http://localhost:2005/api/streak",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

            axios.get(
              "http://localhost:2005/api/rewards"
            ),
          ]);

        const streakData =
          streakResponse.data.streak;

        const rewards =
          rewardsResponse.data.rewards;

        // Find Day 7 reward from backend
        const day7Reward = rewards.find(
          (item) => item.day === 7
        );

        setStreak(streakData);
        setReward(day7Reward || null);
      } catch (error) {
        console.error(
          "Ultimate reward fetch error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUltimateReward();

    // Refresh after streak claim
    const handleStreakUpdate = () => {
      fetchUltimateReward();
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

  // =====================================================
  // DATA
  // =====================================================

  const currentStreak =
    streak?.currentStreak || 0;

  const completedDays =
    streak?.completedDays?.length || 0;

  const isDay7Claimed =
    streak?.completedDays?.includes(7);

  const isDay7Unlocked =
    currentStreak >= 7 ||
    isDay7Claimed;

  const progress = Math.min(
    (completedDays / 7) * 100,
    100
  );

  // =====================================================
  // REWARD DISPLAY
  // =====================================================

  const rewardAmount =
    reward?.currency === "INR"
      ? `₹${reward.amount}`
      : `+${reward?.amount || 0}`;

  const rewardTitle =
    reward?.title || "Ultimate Reward";

  const rewardCurrency =
    reward?.currency || "INR";

  return (
    <section
      id="ultimate-reward"
      className="relative overflow-hidden bg-[#0B1220] px-4 py-16 text-white sm:px-6 lg:px-8"
    >

      {/* ================= BACKGROUND GLOW ================= */}

      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-purple-600/[0.08] blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-indigo-600/[0.08] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* ================= HEADING ================= */}

        <div className="mb-10 text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/[0.08] px-4 py-2">

            <span className="text-sm">
              🏆
            </span>

            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Day 7 Reward
            </span>

          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ultimate Reward
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Complete your 7-day streak and unlock your ultimate reward.
          </p>

        </div>

        {/* ================= MAIN CARD ================= */}

        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#101827] shadow-2xl shadow-black/20">

          {/* Subtle glow */}

          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-purple-600/[0.10] blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-indigo-600/[0.10] blur-3xl" />

          <div className="relative grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">

            {/* =================================================
                LEFT - REWARD IMAGE
            ================================================= */}

            <div className="flex justify-center">

              <div className="relative w-full max-w-md">

                {/* Glow behind image */}

                <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-3xl" />

                {/* Image container */}

                <div className="relative overflow-hidden rounded-3xl border border-purple-400/10 bg-gradient-to-br from-purple-500/[0.08] to-indigo-500/[0.04] p-5 shadow-xl">

                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-purple-500/[0.05]" />

                  <img
                    src={Day7Reward}
                    alt="Day 7 Amazon Gift Card Ultimate Reward"
                    className="relative z-10 mx-auto w-full object-contain drop-shadow-2xl transition duration-500 hover:scale-[1.02]"
                  />

                </div>

                {/* Bottom label */}

                <div className="relative mx-auto -mt-4 w-fit rounded-full border border-white/10 bg-[#151F30] px-4 py-2 shadow-lg">

                  <div className="flex items-center gap-2">

                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 text-xs">
                      {isDay7Unlocked ? "✓" : "🔒"}
                    </span>

                    <span className="text-xs font-semibold text-slate-300">
                      {isDay7Unlocked
                        ? "Day 7 Unlocked"
                        : "Locked until Day 7"}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                RIGHT - CONTENT
            ================================================= */}

            <div className="text-center lg:text-left">

              {/* Badge */}

              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/[0.06] px-4 py-2">

                <span className="text-sm">
                  ✨
                </span>

                <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
                  Ultimate Reward
                </span>

              </div>

              {/* Amount */}

              <div className="mt-5 flex items-baseline justify-center gap-2 lg:justify-start">

                <span className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                  {loading ? "--" : rewardAmount}
                </span>

                <span className="text-sm font-semibold text-slate-500">
                  {rewardCurrency === "INR"
                    ? "Gift Card"
                    : rewardCurrency}
                </span>

              </div>

              {/* Title */}

              <h3 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                {loading
                  ? "Loading..."
                  : rewardTitle}
              </h3>

              {/* Description */}

              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
                Complete your daily check-ins and maintain your streak
                until Day 7 to unlock this reward.
              </p>

              {/* =================================================
                  UNLOCK CARD
              ================================================= */}

              <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">

                <div className="flex items-center gap-4">

                  {/* Icon */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                    {isDay7Unlocked ? "🏆" : "🔐"}
                  </div>

                  {/* Text */}

                  <div className="flex-1 text-left">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Unlock On
                    </p>

                    <div className="mt-1 flex items-center gap-2">

                      <span className="text-lg font-extrabold text-white">
                        Day 7
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                          isDay7Unlocked
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-purple-500/10 text-purple-300"
                        }`}
                      >
                        {isDay7Unlocked
                          ? "Unlocked"
                          : "Locked"}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  PROGRESS
              ================================================= */}

              <div className="mt-6">

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-xs font-semibold text-slate-500">
                    Streak Progress
                  </span>

                  <span className="text-xs font-bold text-purple-300">
                    {completedDays} / 7 Days
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">

                  <div
                    className="h-full rounded-full bg-purple-500 transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

              {/* =================================================
                  STATUS
              ================================================= */}

              <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-black/[0.12] px-4 py-3 lg:justify-start">

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isDay7Unlocked
                      ? "bg-emerald-500/10"
                      : "bg-white/[0.05]"
                  }`}
                >
                  {isDay7Unlocked ? "✓" : "🔒"}
                </div>

                <div className="text-left">

                  <p
                    className={`text-xs font-bold ${
                      isDay7Unlocked
                        ? "text-emerald-300"
                        : "text-slate-300"
                    }`}
                  >
                    {isDay7Claimed
                      ? "Reward Claimed"
                      : isDay7Unlocked
                      ? "Reward Unlocked"
                      : "Reward Locked"}
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-600">
                    {isDay7Claimed
                      ? "Your Day 7 reward has been claimed."
                      : isDay7Unlocked
                      ? "Your Day 7 reward is now available."
                      : "Complete your 7-day streak to unlock."}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              FEATURE FOOTER
          ================================================= */}

          <div className="border-t border-white/[0.07] bg-black/[0.12] px-6 py-5 sm:px-8">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* Feature 1 */}

              <div className="flex items-center justify-center gap-3 sm:justify-start">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-sm">
                  ✓
                </div>

                <div>

                  <p className="text-xs font-bold text-slate-300">
                    Verified Reward
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-600">
                    System verified
                  </p>

                </div>

              </div>

              {/* Feature 2 */}

              <div className="flex items-center justify-center gap-3 sm:justify-start">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-sm">
                  ⚡
                </div>

                <div>

                  <p className="text-xs font-bold text-slate-300">
                    Instant Delivery
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-600">
                    After successful claim
                  </p>

                </div>

              </div>

              {/* Feature 3 */}

              <div className="flex items-center justify-center gap-3 sm:justify-start">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-sm">
                  🛡️
                </div>

                <div>

                  <p className="text-xs font-bold text-slate-300">
                    Safe & Secure
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-600">
                    Protected by system
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================= FOOTNOTE ================= */}

        <p className="mt-6 text-center text-[11px] text-slate-600">
          Reward availability and eligibility are verified by the backend.
        </p>

      </div>

    </section>
  );
}

export default UltimateReward;