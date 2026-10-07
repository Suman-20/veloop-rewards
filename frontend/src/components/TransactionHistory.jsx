import { useEffect, useState } from "react";
import axios from "axios";
import VEsCoin from "../assets/VEs_Coin.png";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH TRANSACTION DATA
  // =====================================================

  const fetchTransactionData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [
        transactionsResponse,
        walletResponse,
        streakResponse,
      ] = await Promise.all([
        axios.get(
          "http://localhost:2005/api/user/transactions",
          config
        ),

        axios.get(
          "http://localhost:2005/api/user/wallet",
          config
        ),

        axios.get(
          "http://localhost:2005/api/streak",
          config
        ),
      ]);

      setTransactions(
        transactionsResponse.data.transactions || []
      );

      setWallet(
        walletResponse.data.wallet || null
      );

      setStreak(
        streakResponse.data.streak || null
      );
    } catch (error) {
      console.error(
        "Transaction history error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD + REFRESH AFTER CLAIM
  // =====================================================

  useEffect(() => {
    fetchTransactionData();

    const handleStreakUpdate = () => {
      fetchTransactionData();
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
  // DATE FORMAT
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Unknown date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // AMOUNT FORMAT
  // =====================================================

  const formatAmount = (transaction) => {
    if (!transaction) {
      return "";
    }

    if (transaction.currency === "INR") {
      return `+₹${transaction.amount}`;
    }

    return `+${transaction.amount} ${transaction.currency}`;
  };

  // =====================================================
  // TOTAL EARNED
  // =====================================================

  const totalEarned = transactions
    .filter(
      (transaction) =>
        transaction.currency === "VES" &&
        transaction.status === "success"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  return (
    <section
      id="transactions"
      className="relative overflow-hidden bg-[#0B1220] px-4 py-16 text-white sm:px-6 lg:px-8"
    >

      {/* Background Glow */}

      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2">

              <span className="h-2 w-2 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50" />

              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Wallet Activity
              </span>

            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Transaction History
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Track your completed rewards and see how your wallet is growing.
            </p>

          </div>

          {/* Live Wallet */}

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-xs font-bold text-emerald-300">
              Wallet Active
            </span>

          </div>

        </div>

        {/* ================= MAIN CARD ================= */}

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20">

          {/* ================= WALLET SUMMARY ================= */}

          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#15102b] via-[#17142f] to-[#101827] px-6 py-8 sm:px-9">

            {/* Glow */}

            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">

              {/* Total Earned */}

              <div>

                <p className="text-sm font-medium text-slate-400">
                  Total Earned
                </p>

                <div className="mt-3 flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">

                    <img
                      src={VEsCoin}
                      alt="VEs Coin"
                      className="h-8 w-8 object-contain drop-shadow-lg"
                    />

                  </div>

                  <div>

                    <p className="text-4xl font-extrabold tracking-tight text-white">

                      {totalEarned}

                      <span className="ml-2 text-xl font-bold text-purple-400">
                        VEs
                      </span>

                    </p>

                  </div>

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Across {transactions.length} completed rewards
                </p>

              </div>

              {/* Current Streak */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-4 backdrop-blur-sm">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Current Streak
                </p>

                <div className="mt-2 flex items-center gap-2">

                  <span className="text-2xl font-extrabold text-white">
                    {streak?.currentStreak || 0}
                  </span>

                  <span className="text-sm font-semibold text-orange-400">
                    {streak?.currentStreak === 1
                      ? "day"
                      : "days"}
                  </span>

                  <span className="text-lg">
                    🔥
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* ================= TRANSACTIONS ================= */}

          <div className="px-5 py-7 sm:px-9 sm:py-8">

            {/* Section Header */}

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h3 className="text-lg font-extrabold text-white">
                  Recent Activity
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Your latest reward transactions
                </p>

              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-bold text-slate-400">
                {transactions.length} Transactions
              </span>

            </div>

            {/* Loading */}

            {loading && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-10 text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-400 border-t-transparent" />

                <p className="mt-4 text-xs text-slate-500">
                  Loading transactions...
                </p>

              </div>
            )}

            {/* Empty State */}

            {!loading && transactions.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-10 text-center">

                <div className="text-3xl">
                  💳
                </div>

                <p className="mt-3 font-bold text-slate-300">
                  No transactions yet
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Your completed rewards will appear here.
                </p>

              </div>
            )}

            {/* Transaction List */}

            {!loading && transactions.length > 0 && (
              <div className="space-y-3">

                {transactions.map((transaction) => (

                  <article
                    key={
                      transaction.transactionId ||
                      transaction._id
                    }
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/20 hover:bg-purple-500/[0.04] hover:shadow-lg hover:shadow-purple-900/10 sm:p-5"
                  >

                    {/* Hover Glow */}

                    <div className="pointer-events-none absolute -right-20 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-purple-600/10 opacity-0 blur-3xl transition duration-300 group-hover:opacity-100" />

                    <div className="relative flex items-center gap-4 sm:gap-5">

                      {/* Icon */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-500/10 text-lg text-emerald-400">
                        ✓
                      </div>

                      {/* Content */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            <h4 className="font-bold text-white">
                              Daily Streak Reward
                            </h4>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                              <span>
                                Day {transaction.streakDay}
                              </span>

                              <span className="text-slate-700">
                                •
                              </span>

                              <span>
                                {formatDate(
                                  transaction.createdAt
                                )}
                              </span>

                            </div>

                          </div>

                          {/* Amount */}

                          <p className="text-lg font-extrabold text-emerald-400">
                            {formatAmount(transaction)}
                          </p>

                        </div>

                        {/* Bottom Info */}

                        <div className="mt-3 flex items-center gap-2">

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">

                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                            {transaction.status === "success"
                              ? "Completed"
                              : transaction.status}

                          </span>

                          <span className="text-[10px] text-slate-600">
                            Added to wallet
                          </span>

                        </div>

                      </div>

                    </div>

                  </article>

                ))}

              </div>
            )}

            {/* Bottom Note */}

            <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 text-center">

              <p className="text-[11px] text-slate-600">
                Reward transactions are securely recorded and verified by the system.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default TransactionHistory;