const express = require("express");
const authRotutes = express.Router();
const authController = require("../controllers/auth.controller");

authRotutes.post("/login", authController.loginWithEmail);
authRotutes.post("/send-email-link", authController.sendEmailLink);
authRotutes.get("/confirm-email", authController.confirmEmail);
authRotutes.post("/send-phone-otp", authController.sendPhoneOtp);
authRotutes.post("/confirm-phone-otp", authController.confirmPhoneOtp);
authRotutes.post("/save-profile", authController.saveProfile);
authRotutes.post("/set-password", authController.setPasswordAndRegister);

authRotutes.get("/google", (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:5000/auth/callback/google&response_type=code&scope=email%20profile`;
  res.redirect(url);
});
authRotutes.get("/callback/google", googleCallback);

authRotutes.get("/github", (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
  res.redirect(url);
});
authRotutes.get("/callback/github", githubCallback);

module.exports = authRotutes;
