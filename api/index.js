const app = require("../src/app");
const connectDB = require("../src/config/db");

// Connect to database
// Mongoose buffers commands, so we don't strict await here for the export,
// but it will connect on the first cold start.
connectDB();

module.exports = app;
