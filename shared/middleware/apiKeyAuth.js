// middleware/apiKeyAuth.js
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const apiKeyAuth = (req, res, next) => {
  const key = req.header("x-api-key");
  const validKey = process.env.API_KEY;

  if (!key || key !== validKey) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or missing API Key" });
  }

  next();
};

const hasRole = (roles) => (req, res, next) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  if (!allowedRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Forbidden: Insufficient permissions" });
  }
  next();
};

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    req.user = decoded; // you now have req.user available
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { apiKeyAuth, hasRole, isAuthenticated };
