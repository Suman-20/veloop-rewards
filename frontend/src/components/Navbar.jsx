import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api.js";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Active navigation item
  const [activeMenu, setActiveMenu] = useState("home");

  // Backend data
  const [streak, setStreak] = useState(0);
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);

  const profileRef = useRef(null);
  const navigate = useNavigate();

  // =====================================================
  // FETCH NAVBAR DATA
  // =====================================================

  const fetchNavbarData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Get user from localStorage
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error(
            "Invalid stored user data:",
            error
          );
        }
      }

      // No token means user is not authenticated
      if (!token) {
        setStreak(0);
        setBalance(0);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch streak + wallet together
      const [streakResponse, walletResponse] =
        await Promise.all([
          axios.get(
            `${API_URL}/api/streak`,
            config
          ),

          axios.get(
            `${API_URL}/api/user/wallet`,
            config
          ),
        ]);

      // ================================
      // STREAK
      // ================================

      const currentStreak =
        streakResponse.data?.streak?.currentStreak || 0;

      setStreak(currentStreak);

      // ================================
      // WALLET
      // ================================

      const vesBalance =
        walletResponse.data?.wallet?.vesBalance || 0;

      setBalance(vesBalance);
    } catch (error) {
      console.error(
        "Navbar data fetch error:",
        error.response?.data || error.message
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchNavbarData();
  }, []);

  // =====================================================
  // REFRESH AFTER STREAK / REWARD UPDATE
  // =====================================================

  useEffect(() => {
    const handleStreakUpdate = () => {
      fetchNavbarData();
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
  // CLOSE PROFILE WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // MENU CLICK
  // =====================================================

  const handleMenuClick = (menu, section) => {
    setActiveMenu(menu);
    setIsOpen(false);

    document
      .getElementById(section)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  // =====================================================
// UPDATE ACTIVE MENU WHILE SCROLLING
// =====================================================

useEffect(() => {
  const sections = [
    { id: "home", menu: "home" },
    { id: "streak", menu: "streak" },
    { id: "rewards", menu: "rewards" },
    { id: "transactions", menu: "transactions" },
  ];

  const handleScroll = () => {
    const scrollPosition = window.scrollY + 120;

    let currentSection = "home";

    sections.forEach(({ id, menu }) => {
      const section = document.getElementById(id);

      if (section && section.offsetTop <= scrollPosition) {
        currentSection = menu;
      }
    });

    setActiveMenu(currentSection);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  handleScroll();

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);





  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("otpIdentifier");
    localStorage.removeItem("otpPurpose");

    setProfileOpen(false);
    setIsOpen(false);

    setUser(null);
    setStreak(0);
    setBalance(0);

    navigate("/login");
  };

  // =====================================================
  // MOBILE MENU CLOSE
  // =====================================================

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  // =====================================================
  // USER DISPLAY NAME
  // =====================================================

  const displayName =
    user?.fullName ||
    user?.name ||
    "VELOOP User";

  // =====================================================
  // USER EMAIL / PHONE
  // =====================================================

  const userIdentifier =
    user?.email ||
    user?.phone ||
    "Rewards Member";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1220]/95 backdrop-blur-xl">

      {/* =================================================
          MAIN NAVBAR
      ================================================= */}

      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =================================================
            LOGO
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            handleMenuClick("home", "home")
          }
          className="group flex items-center gap-3"
        >

          {/* Logo Icon */}

          <div className="relative">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 text-xl font-black text-white shadow-lg shadow-purple-900/30 transition duration-300 group-hover:scale-105">
              V
            </div>

            {/* Glow */}

            <div className="absolute -inset-1 -z-10 rounded-2xl bg-purple-500 opacity-20 blur-md" />

          </div>

          {/* Brand */}

          <div className="leading-none text-left">

            <h1 className="text-[18px] font-extrabold tracking-tight text-white">
              VELOOP
            </h1>

            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-purple-400">
              Rewards
            </p>

          </div>

        </button>

        {/* =================================================
            DESKTOP NAV
        ================================================= */}

        <div className="hidden cursor-pointer items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 shadow-lg shadow-black/10 md:flex">

          {/* HOME */}

          <button
            type="button"
            onClick={() =>
              handleMenuClick("home", "home")
            }
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeMenu === "home"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                : "text-slate-400 hover:bg-white/[0.06] hover:text-purple-300"
            }`}
          >
            Home
          </button>

          {/* DAILY STREAK */}

          <button
            type="button"
            onClick={() =>
              handleMenuClick("streak", "streak")
            }
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeMenu === "streak"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                : "text-slate-400 hover:bg-white/[0.06] hover:text-purple-300"
            }`}
          >
            Daily Streak
          </button>

          {/* REWARDS */}

          <button
            type="button"
            onClick={() =>
              handleMenuClick("rewards", "rewards")
            }
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeMenu === "rewards"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                : "text-slate-400 hover:bg-white/[0.06] hover:text-purple-300"
            }`}
          >
            Rewards
          </button>

          {/* TRANSACTIONS */}

          <button
            type="button"
            onClick={() =>
              handleMenuClick(
                "transactions",
                "transactions"
              )
            }
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeMenu === "transactions"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                : "text-slate-400 hover:bg-white/[0.06] hover:text-purple-300"
            }`}
          >
            Transactions
          </button>

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="hidden items-center gap-2 md:flex">

          {/* =================================================
              STREAK
          ================================================= */}

          <div className="flex items-center gap-2 rounded-xl border border-orange-400/10 bg-orange-500/10 px-3 py-2">

            <span className="text-base">
              🔥
            </span>

            <div className="leading-none">

              <p className="text-[9px] font-semibold uppercase tracking-wide text-orange-300">
                Streak
              </p>

              <p className="mt-1 text-xs font-extrabold text-orange-400">
                {streak} {streak === 1 ? "Day" : "Days"}
              </p>

            </div>

          </div>

          {/* =================================================
              WALLET
          ================================================= */}

          <div className="flex items-center gap-2 rounded-xl border border-purple-400/10 bg-purple-500/10 px-3 py-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-sm shadow-md shadow-purple-900/30">
              🪙
            </div>

            <div className="leading-none">

              <p className="text-[9px] font-semibold uppercase tracking-wide text-purple-300">
                Balance
              </p>

              <p className="mt-1 text-xs font-extrabold text-purple-300">
                {balance} VEs
              </p>

            </div>

          </div>

          {/* =================================================
              PROFILE
          ================================================= */}

          <div
            ref={profileRef}
            className="relative ml-1"
          >

            <button
              type="button"
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-purple-400/20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-lg transition hover:scale-105 hover:border-purple-400/50 hover:bg-purple-500/20"
              aria-label="Open profile menu"
            >
              👤
            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================= */}

            {profileOpen && (
              <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl shadow-black/50">

                {/* User Header */}

                <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 px-5 py-5 text-white">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-xl backdrop-blur">
                      👤
                    </div>

                    <div className="min-w-0">

                      <p className="truncate font-bold">
                        {displayName}
                      </p>

                      <p className="mt-1 truncate text-xs text-purple-100">
                        {userIdentifier}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Balance */}

                <div className="mx-4 mt-4 flex items-center justify-between rounded-xl border border-purple-400/10 bg-purple-500/10 px-4 py-3">

                  <span className="text-xs font-medium text-slate-400">
                    Available Balance
                  </span>

                  <span className="font-bold text-purple-300">
                    {balance} VEs
                  </span>

                </div>

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="m-3 flex w-[calc(100%-24px)] cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >

                  <span className="text-lg">
                    ↪
                  </span>

                  Logout

                </button>

              </div>
            )}

          </div>

        </div>

        {/* =================================================
            MOBILE HAMBURGER
        ================================================= */}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-lg text-purple-300 transition hover:bg-purple-500/10 hover:text-purple-200 md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      {isOpen && (
        <div className="border-t border-white/10 bg-[#0B1220] px-4 pb-5 shadow-2xl shadow-black/30 md:hidden">

          <div className="mx-auto max-w-7xl pt-3">

            {/* =================================================
                MOBILE LINKS
            ================================================= */}

            <div className="space-y-1">

              {/* HOME */}

              <button
                type="button"
                onClick={() =>
                  handleMenuClick("home", "home")
                }
                className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeMenu === "home"
                    ? "bg-purple-600/20 text-purple-300"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-purple-300"
                }`}
              >
                🏠 Home
              </button>

              {/* DAILY STREAK */}

              <button
                type="button"
                onClick={() =>
                  handleMenuClick("streak", "streak")
                }
                className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  activeMenu === "streak"
                    ? "bg-purple-600/20 text-purple-300"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-purple-300"
                }`}
              >
                🔥 Daily Streak
              </button>

              {/* REWARDS */}

              <button
                type="button"
                onClick={() =>
                  handleMenuClick("rewards", "rewards")
                }
                className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  activeMenu === "rewards"
                    ? "bg-purple-600/20 text-purple-300"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-purple-300"
                }`}
              >
                🎁 Rewards
              </button>

              {/* TRANSACTIONS */}

              <button
                type="button"
                onClick={() =>
                  handleMenuClick(
                    "transactions",
                    "transactions"
                  )
                }
                className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  activeMenu === "transactions"
                    ? "bg-purple-600/20 text-purple-300"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-purple-300"
                }`}
              >
                📊 Transactions
              </button>

            </div>

            {/* =================================================
                MOBILE STATS
            ================================================= */}

            <div className="mt-4 grid grid-cols-2 gap-3">

              {/* STREAK */}

              <div className="rounded-xl border border-orange-400/10 bg-orange-500/10 p-3">

                <div className="flex items-center gap-2">

                  <span>
                    🔥
                  </span>

                  <div>

                    <p className="text-[9px] font-semibold uppercase text-orange-300">
                      Streak
                    </p>

                    <p className="text-sm font-bold text-orange-400">
                      {streak}{" "}
                      {streak === 1
                        ? "Day"
                        : "Days"}
                    </p>

                  </div>

                </div>

              </div>

              {/* BALANCE */}

              <div className="rounded-xl border border-purple-400/10 bg-purple-500/10 p-3">

                <div className="flex items-center gap-2">

                  <span>
                    🪙
                  </span>

                  <div>

                    <p className="text-[9px] font-semibold uppercase text-purple-300">
                      Balance
                    </p>

                    <p className="text-sm font-bold text-purple-300">
                      {balance} VEs
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                MOBILE PROFILE
            ================================================= */}

            <div className="mt-4 border-t border-white/10 pt-4">

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 transition hover:bg-white/[0.06]"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/15">
                    👤
                  </div>

                  <div className="text-left">

                    <p className="truncate text-sm font-semibold text-white">
                      {displayName}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {userIdentifier}
                    </p>

                  </div>

                </div>

                <span className="text-slate-500">
                  {profileOpen ? "⌃" : "⌄"}
                </span>

              </button>

              {/* MOBILE LOGOUT */}

              {profileOpen && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  ↪ Logout
                </button>
              )}

            </div>

          </div>

        </div>
      )}

    </nav>
  );
}

export default Navbar;