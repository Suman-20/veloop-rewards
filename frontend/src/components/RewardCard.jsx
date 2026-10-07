import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config/api.js";

function RewardCard() {
  const [status, setStatus] = useState("loading");
  const [showAdDemo, setShowAdDemo] = useState(false);
  const [reward, setReward] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH CURRENT REWARD
  // =====================================================

  useEffect(() => {
    const fetchReward = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setStatus("error");
          return;
        }

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

        const currentReward = rewards.find(
          (item) => item.day === streak.currentDay
        );

        if (!currentReward) {
          setError("No reward available for the current day.");
          setStatus("error");
          return;
        }

        setReward({
          ...currentReward,
          day: currentReward.day,
          amount: currentReward.amount,
          currency: currentReward.currency,
          title:
            currentReward.title ||
            "Daily Streak Reward",
        });

        // Check whether current day is already claimed
        if (
          streak.completedDays?.includes(
            streak.currentDay
          )
        ) {
          setStatus("claimed");
        } else {
          setStatus("available");
        }
      } catch (error) {
        console.error(
          "Fetch reward error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load reward."
        );

        setStatus("error");
      }
    };

    fetchReward();
  }, []);

  // =====================================================
  // CLAIM BUTTON
  // =====================================================

  const handleClaim = () => {
    if (status !== "available") {
      return;
    }

    setShowAdDemo(true);
  };

  // =====================================================
  // BACKEND CLAIM
  // =====================================================

  const finishAdDemo = async () => {
    try {
      setShowAdDemo(false);
      setStatus("claiming");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required.");
        setStatus("error");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/streak/claim`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStatus("claimed");

        // Notify other components that streak/wallet changed
        window.dispatchEvent(
          new Event("streakUpdated")
        );
      }
    } catch (error) {
      console.error(
        "Claim reward error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to claim reward."
      );

      setStatus("available");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (status === "loading") {
    return (
      <section
        id="rewards"
        className="relative overflow-hidden bg-[#0B1220] px-4 py-16 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">

          <div className="text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-5 py-2">
              <span className="text-base">
                🎁
              </span>

              <span className="text-sm font-bold text-purple-300">
                Daily Rewards
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Claim Your Reward
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Loading your current reward...
            </p>

          </div>

        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (status === "error") {
    return (
      <section
        id="rewards"
        className="relative overflow-hidden bg-[#0B1220] px-4 py-16 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">

          <div className="text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-5 py-2">
              <span>⚠️</span>

              <span className="text-sm font-bold text-red-300">
                Reward Error
              </span>
            </div>

            <p className="mx-auto mt-5 max-w-xl text-sm text-red-300">
              {error}
            </p>

          </div>

        </div>
      </section>
    );
  }

  return (
    <>
      {/* =====================================================
          REWARD SECTION
      ===================================================== */}

      <section
        id="rewards"
        className="relative overflow-hidden bg-[#0B1220] px-4 py-16 text-white sm:px-6 lg:px-8"
      >

        {/* Background Glow */}

        <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -left-32 bottom-10 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl">

          {/* Section Heading */}

          <div className="text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-5 py-2">

              <span className="text-base">
                🎁
              </span>

              <span className="text-sm font-bold text-purple-300">
                Daily Rewards
              </span>

            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Claim Your Reward
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Complete your daily streak and claim the
              reward unlocked for you.
            </p>

          </div>

          {/* Main Reward Card */}

          <div className="mx-auto mt-10 max-w-3xl">

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">

              {/* Card Top */}

              <div className="border-b border-white/10 p-6 sm:p-8">

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                  {/* LEFT */}

                  <div className="flex items-center gap-4">

                    {/* Gift Icon */}

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-2xl">
                      🎁
                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-purple-400">
                        Today's Reward
                      </p>

                      <h3 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                        {reward.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Day {reward.day} of your streak
                      </p>

                    </div>

                  </div>

                  {/* RIGHT - AMOUNT */}

                  <div className="rounded-2xl border border-yellow-400/10 bg-yellow-500/[0.05] px-5 py-3 text-left sm:min-w-[130px] sm:text-right">

                    <p className="text-3xl font-extrabold text-yellow-400">
                      {reward.currency === "INR"
                        ? `₹${reward.amount}`
                        : `+${reward.amount}`}
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-yellow-500/70">
                      {reward.currency}
                    </p>

                  </div>

                </div>

              </div>

              {/* Claim Area */}

              <div className="p-6 sm:p-8">

                {/* AVAILABLE */}

                {status === "available" && (
                  <div>

                    <div className="flex items-start gap-3 rounded-2xl border border-purple-400/10 bg-purple-500/[0.05] p-4">

                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-sm">
                        ✨
                      </div>

                      <div>

                        <p className="text-sm font-bold text-slate-200">
                          Your reward is ready
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Your daily reward is available.
                          Continue to verification to proceed
                          with the claim.
                        </p>

                      </div>

                    </div>

                    {/* Claim Button */}

                    <button
                      type="button"
                      onClick={handleClaim}
                      className="mt-5 w-full rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition duration-200 hover:bg-purple-500 active:scale-[0.98]"
                    >
                      Claim Reward
                    </button>

                  </div>
                )}

                {/* CLAIMING */}

                {status === "claiming" && (
                  <div className="py-4 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">

                      <div className="h-7 w-7 animate-spin rounded-full border-4 border-purple-400 border-t-transparent" />

                    </div>

                    <p className="mt-4 text-base font-bold text-white">
                      Confirming your reward...
                    </p>

                    <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
                      Waiting for backend confirmation.
                      The reward will only be credited after
                      successful verification.
                    </p>

                  </div>
                )}

                {/* CLAIMED */}

                {status === "claimed" && (
                  <div className="py-4 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl">
                      🎉
                    </div>

                    <p className="mt-4 text-lg font-extrabold text-emerald-400">
                      Reward Claimed
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Your reward has been successfully
                      confirmed.
                    </p>

                  </div>
                )}

                {/* ERROR */}

                {error && (
                  <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-xs text-red-300">
                    {error}
                  </div>
                )}

              </div>

              {/* Card Footer */}

              <div className="border-t border-white/10 bg-black/10 px-6 py-4 sm:px-8">

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <span className="flex items-center gap-2 text-xs text-slate-500">

                    <span className="text-emerald-400">
                      ✓
                    </span>

                    Secure reward verification

                  </span>

                  <span className="text-xs font-medium text-slate-600">
                    Day {reward.day}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          REWARD VERIFICATION / AD DEMO MODAL
      ===================================================== */}

      {showAdDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#111827] text-white shadow-2xl shadow-black/50">

            {/* Modal Header */}

            <div className="border-b border-white/10 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                  🎁
                </div>

                <div>

                  <h3 className="font-bold text-white">
                    Reward Verification
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Preparing your reward
                  </p>

                </div>

              </div>

            </div>

            {/* Modal Content */}

            <div className="px-6 py-6 text-center">

              <p className="text-sm leading-6 text-slate-400">
                Advertisement / Reward Verification
              </p>

              {/* Progress */}

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.06]">

                <div className="h-full w-2/3 animate-pulse rounded-full bg-purple-500" />

              </div>

              <p className="mt-3 text-xs text-slate-600">
                Demo verification process.
              </p>

              {/* Continue */}

              <button
                type="button"
                onClick={finishAdDemo}
                className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                Continue Demo
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default RewardCard;