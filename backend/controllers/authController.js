import { OAuth2Client } from "google-auth-library";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OTP from "../models/OTP.js";

// ===============================
// Generate OTP
// ===============================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ===============================
// Generate JWT
// ===============================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      phone: user.phone,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};


// ===============================
// Google OAuth2 Client
// ===============================

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

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name,
      email_verified,
    } = payload;

    if (!email || !email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    // Find existing Google user
    let user = await User.findOne({ googleId });

    // If not found, check by email
    if (!user) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    // Create new user
    if (!user) {
      user = await User.create({
        fullName: name || "Google User",
        email: email.toLowerCase(),
        googleId,
        isVerified: true,
      });
    } else {
      // Link Google account if existing email user
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        await user.save();
      }
    }

    // Generate VELOOP JWT
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        walletBalance: user.walletBalance,
        currentStreak: user.currentStreak,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);

    return res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};


// ===============================
// Register User
// ===============================
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    if (!fullName || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        message: "Full name and email or phone are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create unverified user
    let user = existingUser;

    if (!user) {
      user = await User.create({
        fullName,
        email: email ? email.toLowerCase() : undefined,
        phone: phone || undefined,
        isVerified: false,
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Remove old OTP
    await OTP.deleteMany({
      identifier: email?.toLowerCase() || phone,
      purpose: "register",
    });

    // Save OTP
    await OTP.create({
      identifier: email?.toLowerCase() || phone,
      otp,
      purpose: "register",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send OTP to email
    if (email) {
      await sendEmail({
        to: email.toLowerCase(),
        subject: "Your VELOOP Rewards OTP",

        text: `Your VELOOP Rewards OTP is ${otp}. This OTP is valid for 5 minutes. Do not share this OTP with anyone.`,

        html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #f8f8f8;
      ">

        <div style="
          background: #111827;
          padding: 25px;
          border-radius: 12px;
          text-align: center;
        ">

          <h1 style="color: #ffffff; margin-bottom: 5px;">
            VELOOP
          </h1>

          <p style="color: #a78bfa; margin-top: 0;">
            REWARDS
          </p>

          <h2 style="color: #ffffff;">
            Your OTP Code
          </h2>

          <div style="
            background: #ffffff;
            padding: 18px;
            border-radius: 10px;
            margin: 20px 0;
          ">
            <span style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #7c3aed;
            ">
              ${otp}
            </span>
          </div>

          <p style="color: #d1d5db;">
            This OTP is valid for <strong>5 minutes</strong>.
          </p>

          <p style="
            color: #9ca3af;
            font-size: 13px;
          ">
            Please do not share this OTP with anyone.
          </p>

        </div>

        <p style="
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          margin-top: 20px;
        ">
          This is an automated email from VELOOP Rewards.
        </p>

      </div>
    `,
      });

      console.log("=================================");
      console.log("REGISTER OTP EMAIL SENT TO:", email.toLowerCase());
      console.log("=================================");
    }

    return res.status(201).json({
      success: true,
      message: "Registration OTP sent successfully",
      identifier: email?.toLowerCase() || phone,
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ===============================
// Send OTP
// ===============================

export const sendOTP = async (req, res) => {
  try {
    const { identifier, purpose } = req.body;

    // =====================================
    // 1. VALIDATE INPUT
    // =====================================

    if (!identifier || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Identifier and purpose are required",
      });
    }

    // =====================================
    // 2. VALIDATE OTP PURPOSE
    // =====================================

    if (!["register", "login"].includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP purpose",
      });
    }

    // =====================================
    // 3. NORMALIZE IDENTIFIER
    // =====================================

    const normalizedIdentifier = identifier.trim().toLowerCase();

    // =====================================
    // 4. LOGIN USER MUST EXIST
    // =====================================

    if (purpose === "login") {
      const user = await User.findOne({
        $or: [{ email: normalizedIdentifier }, { phone: identifier.trim() }],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // User should be verified
      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: "User is not verified",
        });
      }
    }

    // =====================================
    // 5. OTP ONLY FOR EMAIL
    // =====================================

    if (!normalizedIdentifier.includes("@")) {
      return res.status(400).json({
        success: false,
        message:
          "Email OTP is currently supported. Phone OTP requires an SMS service.",
      });
    }

    // =====================================
    // 6. GENERATE OTP
    // =====================================

    const otp = generateOTP();

    // =====================================
    // 7. DELETE PREVIOUS OTP
    // =====================================

    await OTP.deleteMany({
      identifier: normalizedIdentifier,
      purpose,
    });

    // =====================================
    // 8. CREATE NEW OTP
    // =====================================

    await OTP.create({
      identifier: normalizedIdentifier,
      otp,
      purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // =====================================
    // 9. SEND OTP EMAIL
    // =====================================

    await sendEmail({
      to: normalizedIdentifier,
      subject: "Your VELOOP Rewards OTP",

      text: `Your VELOOP Rewards OTP is ${otp}. This OTP is valid for 5 minutes. Do not share this OTP with anyone.`,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background: #f8f8f8;">
          
          <div style="background: #111827; padding: 25px; border-radius: 12px; text-align: center;">
            
            <h1 style="color: #ffffff; margin-bottom: 5px;">
              VELOOP
            </h1>

            <p style="color: #a78bfa; margin-top: 0;">
              REWARDS
            </p>

            <h2 style="color: #ffffff;">
              Your OTP Code
            </h2>

            <div style="background: #ffffff; padding: 18px; border-radius: 10px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #7c3aed;">
                ${otp}
              </span>
            </div>

            <p style="color: #d1d5db;">
              This OTP is valid for <strong>5 minutes</strong>.
            </p>

            <p style="color: #9ca3af; font-size: 13px;">
              Please do not share this OTP with anyone.
            </p>

          </div>

          <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px;">
            This is an automated email from VELOOP Rewards.
          </p>

        </div>
      `,
    });

    // =====================================
    // 10. SERVER LOG
    // =====================================

    console.log("=================================");
    console.log(
      `${purpose.toUpperCase()} OTP email sent to:`,
      normalizedIdentifier,
    );
    console.log("=================================");

    // =====================================
    // 11. SUCCESS RESPONSE
    // =====================================

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// ===============================
// Verify OTP
// ===============================
export const verifyOTP = async (req, res) => {
  try {
    const { identifier, otp, purpose } = req.body;

    if (!identifier || !otp || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Identifier, OTP and purpose are required",
      });
    }

    const normalizedIdentifier = identifier.toLowerCase();

    const otpRecord = await OTP.findOne({
      identifier: normalizedIdentifier,
      otp,
      purpose,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check expiration
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // ===============================
    // REGISTER
    // ===============================
    if (purpose === "register") {
      const user = await User.findOne({
        $or: [{ email: normalizedIdentifier }, { phone: identifier }],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.isVerified = true;
      await user.save();

      await OTP.deleteOne({ _id: otpRecord._id });

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: "Registration successful",
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          walletBalance: user.walletBalance,
          currentStreak: user.currentStreak,
        },
      });
    }

    // ===============================
    // LOGIN
    // ===============================
    if (purpose === "login") {
      const user = await User.findOne({
        $or: [{ email: normalizedIdentifier }, { phone: identifier }],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your account first",
        });
      }

      await OTP.deleteOne({ _id: otpRecord._id });

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          walletBalance: user.walletBalance,
          currentStreak: user.currentStreak,
        },
      });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

// ===============================
// Login User
// ===============================
export const loginUser = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Email or phone is required",
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User exists. Please request OTP.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
