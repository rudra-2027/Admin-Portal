const mongoose = require("mongoose");
const User = require("../src/models/UserModel");
const { hashPassword } = require("../src/services/auth.services");

(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/pui");

  const user = new User({
    username: "admin",
    email: "admin@pui.dev",
    password: await hashPassword("admin123"),
    role: "ADMIN"
  });

  await user.save();
  console.log("Admin created");
  process.exit();
})();
