require("module-alias/register");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/auth.route");
const errorHandler = require("@shared/middleware/errorHandler");
const { format, transports, loggers } = require("winston");

dotenv.config();
const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.ORIGIN],
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);

app.use(express.json());
app.use(helmet());

// ----------------------
// Logging middleware
// ----------------------

// Winston setup
loggers.add("http", {
  transports: [
    new transports.File({ filename: "logs/http.log" }),
    new transports.Console(),
  ],
  format: format.combine(format.timestamp(), format.json()),
});

const morganStream = {
  write: (message) => loggers.get("http").info(message.trim()),
};

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // simple console logs in dev
} else {
  app.use(morgan("combined", { stream: morganStream })); // production logs via winston
}

// ----------------------
// Routes
// ----------------------
app.get("/", (req, res) => res.send("Auth API running..."));
app.use("/api/v1/auth", authRoutes);

// ----------------------
// Error handler
// ----------------------
app.use(errorHandler);

// ----------------------
// MongoDB connection + server start
// ----------------------
const mongoose = require("mongoose");
const mongoURI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.MONGO_URI_TEST;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("> MongoDB Connected");
    app.listen(process.env.PORT || 3001, () => {
      console.log(
        `> Auth Microservice listening on http://localhost:${
          process.env.PORT || 3001
        }`
      );
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
