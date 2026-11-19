
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Token Configuration

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "30d";
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: REFRESH_COOKIE_MAX_AGE,
  path: "/api/auth",
};

// Create Access Token

const createAccessToken = (user, role) => {
  return jwt.sign(
    { id: user._id, role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
};

// Create Refresh Token

const createRefreshToken = (user, role) => {
  return jwt.sign(
    { id: user._id, role, tokenType: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

// Customer Registration

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body || {};

    const cleanName = fullName?.trim();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPhone = phone?.trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        membership: user.membership,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    console.error("Registration Error:", error.message);

    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
};


// Customer Login

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.membership) {
      user.membership = {
        isActive: true,
        level: "standard",
        discountPercentage: 5,
        totalSpent: 0,
      };

      await user.save();
    }

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets are not configured");
    }
    
    const token = createAccessToken(user, user.role);
    const refreshToken = createRefreshToken(user, user.role);
    
    res.cookie("motogtRefreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        membership: user.membership,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
};


   
// Get Latest Logged-in Customer Profile

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        membership: user.membership,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);

    return res.status(500).json({
      message: "Could not load customer profile.",
    });
  }
};

// Admin Login

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await User.findOne({ email: cleanEmail });

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets are not configured");
    }
    
    const token = createAccessToken(admin, "admin");
    const refreshToken = createRefreshToken(admin, "admin");
    
    res.cookie("motogtAdminRefreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error.message);

    return res.status(500).json({
      message: "Admin login failed. Please try again.",
    });
  }
};
// Refresh Customer Session

exports.refreshCustomerToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.motogtRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Customer session expired. Please login.",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    if (decoded.tokenType !== "refresh" || decoded.role === "admin") {
      throw new Error("Invalid customer refresh token");
    }

    const user = await User.findById(decoded.id);

    if (!user || user.role === "admin") {
      throw new Error("Customer not found");
    }

    const newAccessToken = createAccessToken(user, user.role);
    const newRefreshToken = createRefreshToken(user, user.role);

    res.cookie(
      "motogtRefreshToken",
      newRefreshToken,
      refreshCookieOptions
    );

    return res.status(200).json({
      token: newAccessToken,
    });
  } catch (error) {
    res.clearCookie("motogtRefreshToken", refreshCookieOptions);

    return res.status(401).json({
      message: "Customer session expired. Please login again.",
    });
  }
};


// Refresh Admin Session

exports.refreshAdminToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.motogtAdminRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Admin session expired. Please login.",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    if (decoded.tokenType !== "refresh" || decoded.role !== "admin") {
      throw new Error("Invalid admin refresh token");
    }

    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== "admin") {
      throw new Error("Admin not found");
    }

    const newAccessToken = createAccessToken(admin, "admin");
    const newRefreshToken = createRefreshToken(admin, "admin");

    res.cookie(
      "motogtAdminRefreshToken",
      newRefreshToken,
      refreshCookieOptions
    );

    return res.status(200).json({
      token: newAccessToken,
    });
  } catch (error) {
    res.clearCookie("motogtAdminRefreshToken", refreshCookieOptions);

    return res.status(401).json({
      message: "Admin session expired. Please login again.",
    });
  }
};