const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");

const connectDB = async () => {
  try {
    // console.log(MONGO_URI);

    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
};

module.exports = connectDB;
