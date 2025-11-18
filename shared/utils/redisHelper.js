const redisClient = require("@shared/services/redis.service");

exports.saveSession = async (token, data, expiresIn = 3600) => {
  await redisClient.set(token, JSON.stringify(data), "EX", expiresIn);
};

exports.getSession = async (token) => {
  const raw = await redisClient.get(token);
  return raw ? JSON.parse(raw) : null;
};

exports.deleteSession = async (token) => {
  await redisClient.del(token);
};
