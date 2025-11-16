exports.saveSession = async (token, data, expiresIn = 3600) => {
  await redis.set(token, JSON.stringify(data), "EX", expiresIn);
};

exports.getSession = async (token) => {
  const raw = await redis.get(token);
  return raw ? JSON.parse(raw) : null;
};


exports.deleteSession = async (token) => {
  await redis.del(token);
};