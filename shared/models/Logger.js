// models/SystemLog.js
const mongoose = require("mongoose");

const LoggerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: { type: String, default: "Anonymous" },
    role: { type: String, default: "guest" },
    method: { type: String },
    endpoint: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    action: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Logger", LoggerSchema);
