const authService = require("../services/auth.services");
const User = require("../models/UserModel");
const RefreshToken = require("../models/RefreshToken");


exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Normalize username to lowercase for case-insensitive login
  const normalizedUsername = username.toLowerCase();

  const user = await User.findOne({ username: normalizedUsername, isActive: true });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await authService.comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  user.lastLogin = new Date();
  await user.save();

  const accessToken = authService.generateAccessToken(user);
  const refreshToken = await authService.generateRefreshToken(user._id);

  res.json({
    accessToken,
    refreshToken
  });
};
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  try {
    const newRefreshToken =
      await authService.rotateRefreshToken(refreshToken);

    const stored = await RefreshToken.findOne({
      token: newRefreshToken
    }).populate("userId");

    const newAccessToken =
      authService.generateAccessToken(stored.userId);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
};
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await authService.revokeRefreshToken(refreshToken);
  }
  res.json({ message: "Logged out successfully" });
};
