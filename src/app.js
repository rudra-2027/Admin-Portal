const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const componentRoutes = require("./routes/component.routes");
const adminComponentRoutes = require("./routes/admin.component.routes");
const publicComponentRoutes = require("./routes/public.component.routes");
const componentImageRoutes = require("./routes/component.image.routes");
const adminDashboardRoutes = require("./routes/admin.dashboard.routes");
const userRoutes = require("./routes/user.routes");


const app = express();

// Handle double slashes in URLs (e.g., //api/auth/login)
app.use((req, res, next) => {
  if (req.url.includes("//")) {
    req.url = req.url.replace(/\/+/g, "/");
  }
  next();
});

app.use(helmet());
app.use(cors({
  origin: ["https://admin-portal-frontend-alpha.vercel.app", "http://localhost:5173", "https://admin-portal-rouge-eight.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/components", componentRoutes);
app.use("/api/admin/components", adminComponentRoutes);
app.use("/api/components", publicComponentRoutes);
app.use("/api/components", componentImageRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/users", userRoutes);
module.exports = app;
