const mongoose = require("mongoose");
const User = require("../src/models/UserModel");
const { hashPassword } = require("../src/services/auth.services");

(async () => {
  await mongoose.connect("mongodb+srv://rudragupta200408_db_user:projectUi-admin123@pui-admin.q6ukcxu.mongodb.net/?appName=PUI-ADMIN");

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
