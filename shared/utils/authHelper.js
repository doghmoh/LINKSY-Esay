const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function generateToken(user, expiresIn = "1h") {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: expiresIn }
  );
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = { generateOtp, generateToken };
