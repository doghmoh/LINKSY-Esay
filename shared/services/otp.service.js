const crypto = require("crypto");
const axios = require("axios");
const { generateOtp } = require("@shared/utils/authHelper");

async function sendOtp(phone, otp) {
  const otp = generateOtp();
  const digest = crypto
    .createHash("md5")
    .update(process.env.SMS_API_PASSWORD)
    .digest("hex");
  const payload = {
    messages: [
      { number: phone, text: otp, mask: "LINKSY", clientRef: Date.now() },
    ],
  };
  const response = await axios.post(process.env.SMS_API_URL, payload, {
    headers: {
      USER: process.env.SMS_API_USER,
      DIGEST: digest,
      CREATED: new Date().toISOString(),
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

module.exports = { sendOtp };
