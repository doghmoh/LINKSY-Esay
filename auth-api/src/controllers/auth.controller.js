const { generateToken } = require("@shared/utils/authHelper");
const authService = require("../services/auth.service");

exports.sendEmailLink = async (req, res) => {
  try {
    const { email } = req.body;
    const token = await authService.sendEmailLink(email);
    res.json({ success: true, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const session = await authService.confirmEmail(token);
    res.json({ success: true, session });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    await authService.reqestOtp(phone);
    res.json({ message: `OTP sent to ${phone}` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.confirmPhoneOtp = async (req, res) => {
  try {
    const { token, otp } = req.body;
    const session = await authService.confirmPhone(token, otp);
    res.json({ success: true, session });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.saveProfile = async (req, res) => {
  try {
    const { token, profile } = req.body;
    const session = await authService.saveProfile(token, profile);
    res.json({ success: true, session });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await authService.setPasswordAndRegister(token, password);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginWithEmail(email, password);
    const token = generateToken(user, "7d");
    res.json({ success: true, user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { user, token } = await authService.loginWithGoogle(code);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.githubCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { user, token } = await authService.loginWithGithub(code);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
