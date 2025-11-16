// middleware/systemLogger.js
const logger = require("../utils/loggerHelper");
const Logger = require("../models/Logger"); // corrected import name

const systemLogger = async (req, res, next) => {
  try {
    const monitoredMethods = ["POST", "PUT", "DELETE"]; // only log modifying actions
    if (!monitoredMethods.includes(req.method)) return next();

    const user = req.user || {};
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "Unknown IP";
    const userAgent = req.headers["user-agent"] || "Unknown Agent";

    const action = (() => {
      switch (req.method) {
        case "POST":
          return "created";
        case "PUT":
          return "updated";
        case "DELETE":
          return "deleted";
        default:
          return "accessed";
      }
    })();

    const logMessage = `[${new Date().toISOString()}][${
      user.role || "GUEST"
    }] userId=${user.id || "N/A"}, name=${
      user.username || "Anonymous"
    } — ${action} ${req.originalUrl} (IP: ${ip}, Agent: ${userAgent})`;

    // Save to log file
    logger.info(logMessage);

    // Save to MongoDB
    await Logger.create({
      userId: user.id || null,
      name: user.username || "Anonymous",
      role: user.role || "guest",
      method: req.method,
      endpoint: req.originalUrl,
      ip,
      userAgent,
      action,
      timestamp: new Date(),
    });

    next();
  } catch (error) {
    logger.error("SystemLogger failed: " + error.message);
    next(); // don't block the request even if logging fails
  }
};

module.exports = systemLogger;
