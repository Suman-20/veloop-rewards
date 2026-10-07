import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import API_URL from "../config/api.js";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Google login response

  const handleGoogleResponse = async (response) => {
    try {
      setError("");
      setGoogleLoading(true);

      const googleCredential = response.credential;

      if (!googleCredential) {
        setError("Google authentication failed.");
        return;
      }

      const result = await axios.post(`${API_URL}/api/auth/google`, {
        credential: googleCredential,
      });

      if (result.data.success) {
        // Save VELOOP JWT
        localStorage.setItem("token", result.data.token);

        // Save user information
        localStorage.setItem("user", JSON.stringify(result.data.user));

        // Go to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(
        "Google registration error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message ||
          "Google registration failed. Please try again.",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    const value = identifier.trim();

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!value) {
      setError("Please enter your email or phone number.");
      return;
    }

    try {
      setLoading(true);

      const isEmail = value.includes("@");

      const payload = {
        fullName: fullName.trim(),
        ...(isEmail ? { email: value.toLowerCase() } : { phone: value }),
      };

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        payload,
      );

      if (response.data.success) {
        localStorage.setItem("otpIdentifier", response.data.identifier);

        localStorage.setItem("otpPurpose", "register");

        navigate("/verify-otp");
      }
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
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

        {/* Card */}
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0E1424]/95 shadow-2xl shadow-black/40 backdrop-blur-xl">

          {/* Top Gradient */}
          <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500" />

          <div className="p-6 sm:p-8">

            {/* Logo */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-2xl font-black text-white shadow-lg shadow-purple-500/25">
                V
              </div>

              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Join VELOOP Rewards and start earning
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
                {error}
              </div>
            )}

            {/* Register Form */}
            <form
              onSubmit={handleRegister}
              className="mt-8 space-y-5"
            >
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/10 bg-[#151C2F] px-4 py-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-purple-500 focus:bg-[#182039] focus:ring-4 focus:ring-purple-500/10"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Email
                </label>

                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-white/10 bg-[#151C2F] px-4 py-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-purple-500 focus:bg-[#182039] focus:ring-4 focus:ring-purple-500/10"
                />
              </div>

              {/* Continue */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition-all duration-200 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Sending OTP..." : "Continue with OTP"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Or
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Google Login */}
            <div className="flex min-h-[44px] w-full justify-center overflow-hidden rounded-xl">
              <GoogleLogin
                onSuccess={handleGoogleResponse}
                onError={() => {
                  setError(
                    "Google registration failed. Please try again."
                  );
                }}
                text="signup_with"
                theme="filled_black"
                size="large"
                width="100%"
                shape="rectangular"
              />
            </div>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-purple-400 transition hover:text-purple-300"
              >
                Login
              </Link>
            </p>

          </div>
        </div>

        {/* Bottom Text */}
        <p className="mt-6 text-center text-xs text-slate-600">
          © 2026 VELOOP Rewards. All rights reserved.
        </p>

      </div>
    </div>
  </div>
);
}

export default Register;
