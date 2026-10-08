import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import API_URL from "../config/api.js";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Google Login - UNCHANGED
  // =========================
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

        // Save user
        localStorage.setItem(
          "user",
          JSON.stringify(result.data.user)
        );

        // Go to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(
        "Google login error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Google login failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // =========================
  // Email + Password Login
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: trimmedEmail,
          password,
        }
      );

      if (response.data.success) {
        // Save JWT
        localStorage.setItem("token", response.data.token);

        // Save user
        if (response.data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
          );
        }

        // Go to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
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

          {/* Login Card */}
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
                  Welcome Back
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Login to continue to VELOOP Rewards
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form
                onSubmit={handleLogin}
                className="mt-8 space-y-5"
              >

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-[#151C2F] px-4 py-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-purple-500 focus:bg-[#182039] focus:ring-4 focus:ring-purple-500/10 disabled:cursor-not-allowed disabled:bg-[#111827]"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      disabled={loading}
                      className="w-full rounded-xl border border-white/10 bg-[#151C2F] px-4 py-3.5 pr-12 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-purple-500 focus:bg-[#182039] focus:ring-4 focus:ring-purple-500/10 disabled:cursor-not-allowed disabled:bg-[#111827]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-white"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition-all duration-200 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
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

              {/* Google Login - UNCHANGED */}
              <div className="flex min-h-[44px] w-full justify-center overflow-hidden rounded-xl">
                <GoogleLogin
                  onSuccess={handleGoogleResponse}
                  onError={() => {
                    setError(
                      "Google login failed. Please try again."
                    );
                  }}
                  text="continue_with"
                  theme="filled_black"
                  size="large"
                  width="100%"
                  shape="rectangular"
                />
              </div>

              {/* Register */}
              <p className="mt-7 text-center text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-purple-400 transition hover:text-purple-300"
                >
                  Create Account
                </Link>
              </p>

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

export default Login;