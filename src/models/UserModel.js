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

module.exports = mongoose.model("User", userSchema);
