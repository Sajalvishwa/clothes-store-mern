
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ============================
// Register New User
// ============================
const registerUser = async (req, res) => {
  try {
    // Get user data from request body
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return user details (excluding password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Handle unexpected server errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Login User
// ============================
const loginUser = async (req, res) => {
  try {
    // Get login credentials
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // Invalid password
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Return token and user details
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Handle unexpected server errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Get Logged In User Profile
// ============================
const getProfile = async (req, res) => {
  try {
    // Get user id from auth middleware
    const userId = req.user.id;

    // Fetch user data without password
    const user = await User.findById(userId).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return user profile
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    // Handle unexpected server errors
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Export all controller functions
module.exports = { registerUser, loginUser, getProfile };
