const express = require("express");
const authRotutes = express.Router();
const authController = require("./auth.controller");

authRotutes.post("/login", authController.loginWithEmail);
authRotutes.post("/send-email-link", authController.sendEmailLink);
authRotutes.get("/confirm-email", authController.confirmEmail);
authRotutes.post("/send-phone-otp", authController.sendPhoneOtp);
authRotutes.post("/confirm-phone-otp", authController.confirmPhone);
authRotutes.post("/save-profile", authController.saveProfile);
authRotutes.post("/set-password", authController.setPasswordAndRegister);

module.exports = authRotutes;
