import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api.js";

function VerifyOTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================
  // OTP INPUT CHANGE
  // =====================================

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    // Automatically move to next box
    if (value && index < 5) {
      document
        .getElementById(`otp-${index + 1}`)
        ?.focus();
    }
  };

  // =====================================
  // BACKSPACE
  // =====================================

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      document
        .getElementById(`otp-${index - 1}`)
        ?.focus();
    }
  };

  // =====================================
  // VERIFY OTP
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    const identifier =
      localStorage.getItem("otpIdentifier");

    const purpose =
      localStorage.getItem("otpPurpose") || "register";

    if (!identifier) {
      setError(
        "Verification session expired. Please register again."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/verify-otp`,
        {
          identifier,
          otp: enteredOTP,
          purpose,
        }
      );

      if (response.data.success) {
        // =====================================
        // SAVE JWT TOKEN
        // =====================================

        localStorage.setItem(
          "token",
          response.data.token
        );

        // Save user data if needed later
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        // Remove temporary OTP data
        localStorage.removeItem("otpIdentifier");
        localStorage.removeItem("otpPurpose");

        // Go to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(
        "OTP verification error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // RESEND OTP
  // =====================================

  const handleResendOTP = async () => {
    setError("");

    const identifier =
      localStorage.getItem("otpIdentifier");

    const purpose =
      localStorage.getItem("otpPurpose") || "register";

    if (!identifier) {
      setError(
        "Verification session expired. Please register again."
      );
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_URL}/api/auth/send-otp`,
        {
          identifier,
          purpose,
        }
      );

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      document.getElementById("otp-0")?.focus();
    } catch (error) {
      console.error(
        "Resend OTP error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to resend OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-[#070B17] px-4 py-8 sm:px-6 sm:py-10">
    {/* Background Glow */}
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
    </div>

    <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
      <div className="w-full">

        {/* Main Card */}
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0E1424]/95 shadow-2xl shadow-black/40 backdrop-blur-xl">

          {/* Top Gradient */}
          <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500" />

          <div className="p-6 text-center sm:p-8">

            {/* Logo */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-2xl font-black text-white shadow-lg shadow-purple-500/25">
              V
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
              Verify OTP
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Enter the 6-digit verification code sent to
              your email or phone number.
            </p>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-left text-sm font-medium text-red-400">
                {error}
              </div>
            )}

            {/* OTP Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >
              {/* OTP Inputs */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) =>
                      handleChange(
                        e.target.value,
                        index
                      )
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(e, index)
                    }
                    className="h-12 w-11 rounded-xl border border-white/10 bg-[#151C2F] text-center text-lg font-bold text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-purple-500 focus:bg-[#182039] focus:ring-4 focus:ring-purple-500/10 sm:h-14 sm:w-12"
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition-all duration-200 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>
            </form>

            {/* Resend */}
            <div className="mt-7">
              <p className="text-sm text-slate-400">
                Didn't receive the code?
              </p>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="mt-2 text-sm font-bold text-purple-400 transition hover:text-purple-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>

            {/* Back to Login */}
            <Link
              to="/login"
              className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition hover:text-slate-300"
            >
              <span>←</span>
              Back to Login
            </Link>

          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-600">
          © 2026 VELOOP Rewards. All rights reserved.
        </p>

      </div>
    </div>
  </div>
);
  
}

export default VerifyOTP;