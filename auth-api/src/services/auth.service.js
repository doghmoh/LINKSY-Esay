const bcrypt = require("bcryptjs");
const path = require("path");
const User = require("@shared/models/User");
const {
  saveSession,
  getSession,
  deleteSession,
} = require("@shared/utils/redisHelper");
const {
  generateToken,
  generateEmailLinkToken,
} = require("@shared/utils/authHelper");
const { sendEmail } = require("@shared/services/mailer.service");
const { sendOtp } = require("@shared/services/otp.service");
const fs = require("fs");

// Send account confirmation email
async function sendEmailLink(email, userName) {
  const token = generateEmailLinkToken(email);
  await saveSession(
    token,
    { email, currentStep: "emailSent", profile: {} },
    3600
  );

  const confirmationLink = `${process.env.API_URL_PROD}/auth/confirm-email?token=${token}`;

  const templatePath = path.join(
    __dirname,
    "..", // services → src
    "..", // src → auth-api
    "..", // auth-api → LINKSY
    "shared",
    "templates",
    "accountConfirmationEmail.html"
  );

  const templateHTML = fs.readFileSync(templatePath, "utf-8");
  // Call mailer service with template variables
  await sendEmail(
    email,
    "Confirmez votre compte",
    {
      userName,
      confirmationLink,
      expirationTime: "24 heures",
      logo: "Votre Logo",
      year: new Date().getFullYear(),
      helpLink: "#",
      contactLink: "#",
      termsLink: "#",
    },
    templateHTML
  );

  return token;
}
async function confirmEmail(token) {
  const session = await getSession(token);
  if (!session) throw new Error("Invalid or expired token");
  session.currentStep = "personalDetails";
  await saveSession(token, session, 3600);
  return session;
}

async function requestOtp(phone, token) {
  const session = await getSession(token);
  if (!session) throw new Error("Invalid or expired token");
  let otp;
  if (process.env.NODE_ENV === "production") {
    // generate a 6-digit OTP
    otp = Math.floor(100000 + Math.random() * 900000).toString();

    // send OTP SMS
    await sendOtp(phone, otp);
  } else {
    // development: just generate OTP without sending
    otp = "123456";
  }

  // save session in Redis for 10 minutes
  await saveSession(token, { phone, currentStep: "verifyPhone", otp }, 10 * 60);
}

async function confirmPhone(token, otp) {
  const session = await getSession(token);
  if (!session) throw new Error("Invalid or expired token");
  if (session.otp !== otp) throw new Error("Invalid OTP");
  session.currentStep = "accountType";
  delete session.otp;
  await saveSession(token, session);
  return session;
}

async function saveProfile(token, profile) {
  const session = await getSession(token);
  if (!session) throw new Error("Session not found");
  // Merge new profile info
  session.profile = { ...session.profile, ...profile };

  // Determine next step
  session.currentStep = "verifyPhone";

  await saveSession(token, session, 3600);
}

async function setPasswordAndRegister(token, password) {
  const session = await getSession(token);
  if (!session) throw new Error("Session not found");
  if (!session.currentStep === "setPassword")
    throw new Error("Invalid or expired token");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ ...session, password: hashedPassword });
  await deleteSession(token);
  return user;
}

async function loginWithEmail(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid password");
  user.password = undefined;
  const token = generateToken(user, "7d");
  return { user, token };
}

async function loginWithGoogle(code) {
  // 1. Get user by OAuth ID
  let user = await User.findOne({ googleId: code });

  // 2. If user exists
  if (user) {
    if (user.phoneConfirmed) {
      // phone verified → issue token
      const token = generateToken(user, "7d");
      return { user, token };
    } else {
      // phone not verified → return phone verification URL
      return { nextStep: `/verify-phone?userId=${user._id}` };
    }
  }

  // 3. User does not exist → create account (email verification)
  const newUser = await User.create({
    googleId: code,
    email: "extracted-from-google", // fetch from Google API
    isEmailVerified: false,
    isPhoneVerified: false,
  });

  return { nextStep: `/verify-email?userId=${newUser._id}` };
}

async function loginWithGithub(code) {
  let user = await User.findOne({ githubId: code });

  if (user) {
    if (user.phoneConfirmed) {
      const token = generateToken(user, "7d");
      return { user, token };
    } else {
      return { nextStep: `/verify-phone?userId=${user._id}` };
    }
  }

  const newUser = await User.create({
    githubId: code,
    email: "extracted-from-github",
  });

  return { nextStep: `/verify-email?userId=${newUser._id}` };
}

module.exports = {
  sendEmailLink,
  confirmEmail,
  requestOtp,
  confirmPhone,
  saveProfile,
  setPasswordAndRegister,
  loginWithEmail,
  loginWithGoogle,
  loginWithGithub,
};
