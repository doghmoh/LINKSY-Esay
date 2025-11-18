const authService = require("../services/auth.service");
const { getSession } = require("@shared/utils/redisHelper");
const otpRateLimiter = require("@shared/utils/otpRateLimiter");

exports.sendEmailLink = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const token = await authService.sendEmailLink(email);

    return res.json({ success: true, token });
  } catch (err) {
    console.error("sendEmailLink error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;
    await authService.confirmEmail(token);
    // After confirming email
    const frontendUrl = `${process.env.FRONTEND_URL}/register2?step=personalDetails`;
    res.redirect(frontendUrl);
  } catch (err) {
    // Redirect to error page or show error on frontend
    const errorUrl = `${
      process.env.FRONTEND_URL
    }/register2/error?message=${encodeURIComponent(err.message)}`;
    res.redirect(errorUrl);
  }
};

exports.sendPhoneOtp = async (req, res) => {
  try {
    const { phone, token } = req.body;
    const ip = req.ip;
    // enforce rate limit
    // await otpRateLimiter.consumeOtp(phone, ip);
    await authService.requestOtp(phone, token);
    res.json({ message: `OTP sent to ${phone}` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.confirmPhoneOtp = async (req, res) => {
  try {
    const { token, otp } = req.body;
    await authService.confirmPhone(token, otp);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.saveProfile = async (req, res) => {
  try {
    const { token, profile } = req.body;
    if (!token) throw new Error("Session not found");
    await authService.saveProfile(token, profile);
    res.json({ success: true });
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
    const { user, token } = await authService.loginWithEmail(email, password);
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

exports.getCurrentStep = async (req, res) => {
  try {
    const { token } = req.query;
    const session = await getSession(token);
    if (!session) throw new Error("Session expired");

    res.json({ currentStep: session.currentStep });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
