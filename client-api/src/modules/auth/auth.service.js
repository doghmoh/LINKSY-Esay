const bcrypt = require("bcryptjs");
const User = require("@shared/models/User");
const {
  saveSession,
  getSession,
  deleteSession,
} = require("@shared/utils/redisHelper");
const { generateToken, generateOtp } = require("@shared/utils/authHelper");
const { sendEmail } = require("@shared/services/mailer.service");
const { sendOtp } = require("@shared/services/otp.service");

async function sendEmailLink(email) {
  const token = generateToken();
  await saveSession(token, { email, emailConfirmed: false }, 15 * 60);
  const link = `${process.env.API_URL}/auth/confirm-email?token=${token}`;
  await sendEmail(
    email,
    "Confirm your email",
    `Click <a href="${link}">here</a> to confirm`
  );
  return token;
}

async function confirmEmail(token) {
  const session = await getSession(token);
  if (!session) throw new Error("Invalid or expired token");
  session.emailConfirmed = true;
  await saveSession(token, session);
  return session;
}

async function sendPhoneOtp(phone) {
  await sendOtp(phone);
  const token = generateToken();
  await saveSession(token, { phone, phoneConfirmed: false, otp }, 10 * 60);
  return token;
}

async function confirmPhone(token, otp) {
  const session = await getSession(token);
  if (!session) throw new Error("Invalid or expired token");
  if (session.otp !== otp) throw new Error("Invalid OTP");
  session.phoneConfirmed = true;
  delete session.otp;
  await saveSession(token, session);
  return session;
}

async function saveProfile(token, data) {
  const session = await getSession(token);
  if (!session) throw new Error("Session not found");
  const updated = { ...session, ...data };
  await saveSession(token, updated);
  return updated;
}

async function setPasswordAndRegister(token, password) {
  const session = await getSession(token);
  if (!session) throw new Error("Session not found");
  if (!session.emailConfirmed || !session.phoneConfirmed)
    throw new Error("Email or phone not confirmed");

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
  return user;
}

module.exports = {
  sendEmailLink,
  confirmEmail,
  sendPhoneOtp,
  confirmPhone,
  saveProfile,
  setPasswordAndRegister,
  loginWithEmail,
};
