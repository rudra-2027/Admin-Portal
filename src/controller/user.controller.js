const User = require("../models/UserModel");
const authService = require("../services/auth.services");

exports.createUser = async (req, res) => {
  try {
    let { username, email, password, role } = req.body;

    // Normalize casing
    username = username?.toLowerCase();
    email = email?.toLowerCase();

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: "Username or email already exists" });
    }

    // Hash password
    const hashedPassword = await authService.hashPassword(password);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "CONTRIBUTOR",
      isActive: true
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Send welcome email
    const emailService = require("../services/email.component.js");
    await emailService.notifyUserCreated(user, password);

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, role, password } = req.body;

    const updateData = {};

    if (typeof isActive !== "undefined") {
      updateData.isActive = isActive;
    }

    if (role) {
      updateData.role = role;
    }

    if (password) {
      updateData.password = await authService.hashPassword(password);
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send update notification
    const emailService = require("../services/email.component.js");
    await emailService.notifyUserUpdated(user);

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send deletion notification
    const emailService = require("../services/email.component.js");
    await emailService.notifyUserDeleted(user);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
