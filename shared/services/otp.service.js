const axios = require("axios");
const crypto = require("crypto");
const https = require("https");

const agent = new https.Agent({ rejectUnauthorized: false });

exports.sendOtp = async (number, otp) => {
  const now = new Date().toISOString();

  const smsApiPassword = process.env.SMS_API_PASSWORD || "djAz24@iRApi";
  const smsApiUrl =
    process.env.SMS_API_URL || "https://messengerpal.com/api/sms/send";
  const smsApiUsername = process.env.SMS_API_USER || "mubtakar.api";

  const digest = crypto.createHash("md5").update(smsApiPassword).digest("hex");

  // same as your sendOtp() message
  const message = {
    clientRef: "900199",
    number,
    mask: "LINKSY",
    text: otp,
    campaignName: "LINKSY_OTP_SENDER",
    flash: 0,
    isScheduled: 0,
  };

  try {
    const res = await axios.post(
      smsApiUrl,
      { message },
      {
        headers: {
          "Content-Type": "application/json",
          USER: smsApiUsername,
          DIGEST: digest,
          CREATED: now,
        },
        timeout: 10000,
        httpsAgent: agent,
      }
    );
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.error("SMS Provider Error", e);
    return { resultCode: 101, resultDesc: "API error" };
  }
};
