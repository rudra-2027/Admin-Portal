const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    index: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["ADMIN", "CONTRIBUTOR"],
    default: "CONTRIBUTOR"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, { timestamps: true });

// Pre-save hook to enforce casing
userSchema.pre('save', function (next) {
  if (this.isModified('username')) {
    this.username = this.username.toLowerCase();
  }
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  if (this.isModified('role')) {
    this.role = this.role.toUpperCase();
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
