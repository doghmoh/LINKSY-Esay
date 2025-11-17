const { RateLimiterRedis } = require("rate-limiter-flexible");
const redisClient = require("@shared/services/redis.service");

const otpLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "otp",
  points: 3, // 3 OTP per minute
  duration: 60,
  blockDuration: 60,
});

const ipLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "otp_ip",
  points: 3,
  duration: 3600,
  blockDuration: 3600,
});

const OTP_BLOCK_PREFIX = "otp_block";
const OTP_BLACKLIST_PREFIX = "otp_blacklist";

async function checkBlacklist(phone) {
  const isBlacklisted = await redisClient.get(
    `${OTP_BLACKLIST_PREFIX}:${phone}`
  );
  return !!isBlacklisted;
}

async function recordSecondBlock(phone) {
  const blockCountKey = `${OTP_BLOCK_PREFIX}:${phone}`;
  const count = await redisClient.incr(blockCountKey);

  if (count === 1) {
    await redisClient.expire(blockCountKey, 24 * 3600); // 24h block
  }

  if (count >= 2) {
    await redisClient.set(`${OTP_BLACKLIST_PREFIX}:${phone}`, "true");
    return true;
  }

  return false;
}

// Combined function
async function consumeOtp(phone, ip) {
  if (await checkBlacklist(phone)) {
    throw new Error("Phone permanently blacklisted");
  }

  try {
    await otpLimiter.consume(phone); // Phone-based limit
    await ipLimiter.consume(ip); // IP-based limit
    return { allowed: true };
  } catch (err) {
    const blacklisted = await recordSecondBlock(phone);
    if (blacklisted) {
      throw new Error("Phone permanently blacklisted after repeated attempts");
    }
    throw new Error("Too many OTP requests, try again later");
  }
}

module.exports = {
  consumeOtp,
};
