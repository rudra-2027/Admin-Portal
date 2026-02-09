const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const crypto = require("crypto");

exports.hashPassword = (password) =>
  bcrypt.hash(password, 12);

exports.comparePassword = (password, hash) =>
  bcrypt.compare(password, hash);

exports.generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

exports.generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString("hex");

  const refreshToken = await RefreshToken.create({
    userId,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });

  return refreshToken.token;
};

exports.rotateRefreshToken = async (oldToken) => {
  const stored = await RefreshToken.findOne({ token: oldToken });
  if (!stored || stored.expiresAt < new Date()) {
    throw new Error("Invalid refresh token");
  }

  await RefreshToken.deleteOne({ _id: stored._id });

  return this.generateRefreshToken(stored.userId);
};

exports.revokeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};