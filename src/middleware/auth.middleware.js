const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const { JWT_SECRET } = require("../config/env");

exports.protect = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
    
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization required" });
      }

      const token = authHeader.split(" ")[1];

    
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: "User inactive or not found" });
      }

     
      if (
        allowedRoles.length &&
        !allowedRoles.includes(user.role)
      ) {
        return res.status(403).json({ error: "Access denied" });
      }

     
      req.user = {
        id: user._id,
        role: user.role
      };

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};
