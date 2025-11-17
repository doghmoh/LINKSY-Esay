const express = require("express");
const authController = require("../controllers/auth.controller");

const authRoutes = express.Router();

// ---- AUTH ROUTES ----
authRoutes.post("/login", authController.loginWithEmail);
authRoutes.post("/send-email-link", authController.sendEmailLink);
authRoutes.get("/confirm-email", authController.confirmEmail);
authRoutes.post("/send-phone-otp", authController.sendPhoneOtp);
authRoutes.post("/confirm-phone-otp", authController.confirmPhoneOtp);
authRoutes.post("/save-profile", authController.saveProfile);
authRoutes.post("/set-password", authController.setPassword);

// ---- OAUTH HANDLERS ----
const googleAuthRedirect = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:5000/auth/callback/google&response_type=code&scope=email%20profile`;
  res.redirect(url);
};

const githubAuthRedirect = (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
  res.redirect(url);
};

// ---- OAUTH ROUTES ----
authRoutes.get("/google", googleAuthRedirect);
authRoutes.get("/callback/google", authController.googleCallback);
authRoutes.get("/github", githubAuthRedirect);
authRoutes.get("/callback/github", authController.githubCallback);

module.exports = authRoutes;
