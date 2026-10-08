import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import API_URL from "../config/api.js";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // =========================
  // Normal Registration
  // =========================
  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Username validation
    if (!trimmedUsername) {
      setError("Please enter your username.");
      return;
    }

    if (trimmedUsername.length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    }

    // Email validation
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Confirm password validation
    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        fullName: trimmedUsername,
        email: trimmedEmail,
        password: password,
      };

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        payload,
      );

      if (response.data.success) {
        // Save token if backend returns it
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        // Save user if backend returns it
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Go directly to dashboard
        navigate("/dashboard");
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
              <form onSubmit={handleRegister} className="mt-8 space-y-5">
                {/* Username */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Username
                  </label>

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full rounded-xl border border-white/10 bg-[#151C2F] px-4 py-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-purple-500 focus:bg-[#182039] focus:ring-4 focus:ring-purple-500/10"
                  />
                </div>

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
                    className="w-full rounded-xl border border-white/10 bg-[#151C2F] px-4 py-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-purple-500 focus:bg-[#182039] focus:ring-4 focus:ring-purple-500/10"
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
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-white/10 bg-[#151C2F] px-4 py-3.5 pr-12 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-purple-500 focus:bg-[#182039] focus:ring-4 focus:ring-purple-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-white/10 bg-[#151C2F] px-4 py-3.5 pr-12 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-purple-500 focus:bg-[#182039] focus:ring-4 focus:ring-purple-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition-all duration-200 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Account"}
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
                    setError("Google registration failed. Please try again.");
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
