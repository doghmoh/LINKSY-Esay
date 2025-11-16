const Logger = require("../models/Logger");

logger.system = async ({ user, action, target, ip, userAgent }) => {
  const msg = `[${user.role}] userId=${user._id}, name=${user.username} — ${action} ${target} (IP: ${ip})`;
  logger.info(msg);

  await Logger.create({
    userId: user._id,
    name: user.username,
    role: user.role,
    method: "SYSTEM",
    endpoint: target,
    ip,
    userAgent,
    action,
  });
};
