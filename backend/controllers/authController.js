import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =====================================================
// JWT TOKEN
// =====================================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      phone: user.phone || null,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =====================================================
// GOOGLE LOGIN
// IMPORTANT: Google Login Logic Kept
// =====================================================

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google ID Token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name,
      picture,
      email_verified,
    } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account email not found",
      });
    }

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    // Find user by Google ID
    let user = await User.findOne({ googleId });

    // If not found, find by email
    if (!user) {
      user = await User.findOne({ email: email.toLowerCase() });

      // Existing email account -> link Google account
      if (user) {
        user.googleId = googleId;
        user.isVerified = true;

        if (!user.fullName && name) {
          user.fullName = name;
        }

        await user.save();
      }
    }

    // Create new Google user
    if (!user) {
      user = await User.create({
        fullName: name || "Google User",
        email: email.toLowerCase(),
        googleId,
        isVerified: true,
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || null,
        picture: picture || null,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Google login failed",
      error: error.message,
    });
  }
};

// =====================================================
// NORMAL REGISTER - EMAIL + PASSWORD
// =====================================================

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    const trimmedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // -----------------------------
    // Check existing user
    // -----------------------------

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists. Please login or continue with Google.",
      });
    }

    // -----------------------------
    // Hash password
    // -----------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // -----------------------------
    // Create user
    // OTP is no longer required
    // -----------------------------

    const user = await User.create({
      fullName: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,

      // Since OTP verification has been removed
      isVerified: true,

      walletBalance: 0,
      currentStreak: 0,
      lastClaimAt: null,
    });

    // -----------------------------
    // Generate JWT
    // -----------------------------

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || null,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// =====================================================
// NORMAL LOGIN - EMAIL + PASSWORD
// =====================================================

export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // -----------------------------
    // Find user
    //
    // password has select:false
    // so explicitly select it
    // -----------------------------

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // -----------------------------
    // Check password exists
    //
    // Old OTP-created accounts may
    // not have a password
    // -----------------------------

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message:
          "Password is not set for this account. Please create a new account or use Google Login.",
      });
    }

    // -----------------------------
    // Compare password
    // -----------------------------

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // -----------------------------
    // Generate JWT
    // -----------------------------

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || null,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};