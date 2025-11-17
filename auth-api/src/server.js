require("module-alias/register");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const errorHandler = require("../../shared/middleware/errorHandler");
const authRoutes = require("./routes/auth.route");

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.ORIGIN],
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

// Example route
app.get("/", (req, res) => res.send("Auth API running..."));
app.use("/api/v1/auth", authRoutes);

// Error handler
app.use(errorHandler);

// Connect DB and start server
const mongoURI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.MONGO_URI_TEST;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("> MongoDB Connected");
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `> Auth Microservice listening on http://localhost:${
          process.env.PORT || 3001
        }`
      );
    });
  })
  .catch((err) => console.error("Mongo Error", err));
