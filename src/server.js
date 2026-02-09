const app = require("./app");
const connectDB = require("./config/db");

connectDB();

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
