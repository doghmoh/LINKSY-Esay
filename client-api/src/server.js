require("module-alias/register");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const errorHandler = require("../../shared/middleware/errorHandler");
const routerV1 = require("./routes/v1");

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
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(helmet());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Example route
app.get("/", (req, res) => res.send("API running..."));
app.use("/api/v1", routerV1);

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
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server on http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => console.error("Mongo Error", err));
