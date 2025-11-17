// src/providers/smsProvider.ts
const axios = require("axios");
const crypto = require("crypto");
const https = require("https");

const agent = new https.Agent({ rejectUnauthorized: false });

exports.sendSms = async (payload) => {
  const now = new Date().toISOString();

  const smsApiPassword = process.env.SMS_API_PASSWORD;
  const smsApiUrl = process.env.SMS_API_URL;
  const smsApiUsername = process.env.SMS_API_USER;

  const digest = crypto.createHash("md5").update(smsApiPassword).digest("hex");

  // same as your sendOtp() message
  const message = {
    clientRef: payload.clientRef,
    number: payload.number,
    mask: "LINKSY",
    text: payload.text,
    campaignName: payload.campaignName || "Default Campaign",
    flash: payload.flash || 0,
    isScheduled: payload.isScheduled || 0,
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

    return res.data;
  } catch (e) {
    console.error("SMS Provider Error", e);
    return { resultCode: 101, resultDesc: "API error" };
  }
};
