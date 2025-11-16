const { Server } = require("socket.io");
const { redisPub, redisSub } = require("../services/redisClient");

let io = null;
function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        process.env.ORIGIN || "http://161.97.153.124:5173",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  redisSub.subscribe("job-events", (err) => {
    if (err) console.error("❌ Redis subscription error:", err);
    else console.log("📡 Subscribed to job-events channel");
  });

  redisSub.on("message", (channel, message) => {
    if (channel !== "job-events") return;

    try {
      const data = JSON.parse(message);
      const io = getSocketIO();

      switch (data.type) {
        case "job-completed":
          console.log(
            `🎉 Job ${data.jobId} completed, notifying ${data.socketId}`
          );
          if (data.socketId) {
            io.to(data.socketId).emit("job-completed", {
              quoteId: data.quoteId,
              jobId: data.jobId,
              results: data.results,
            });
          }
          break;

        case "job-failed":
          console.log(`💥 Job ${data.jobId} failed`);
          if (data.socketId) {
            io.to(data.socketId).emit("job-failed", {
              jobId: data.jobId,
              error: data.error,
            });
          }
          break;
        case "job-db":
          if (data.socketId) {
            io.to(data.socketId).emit("db-progress", {
              quoteId: data.quoteId,
              results: data.results,
              metrics: data.metrics,
            });
          }
      }
    } catch (err) {
      console.error("❌ Failed to parse Redis message:", err);
    }
  });
  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    const { userId, token } = socket.handshake.auth;

    console.log(
      `✅ Socket connected: ${socket.id} (User: ${userId || "Guest"})`
    );

    // ✅ Optionally verify token here (recommended)
    if (!userId) {
      console.warn("⚠️ Missing userId in socket auth — disconnecting");
      socket.disconnect(true);
      return;
    }

    // Join its own room (so io.to(socket.id) works)
    socket.join(socket.id);

    socket.on("embeddingProgress", () => {
      console.log(`🚀 Embedding started for socket: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  console.log("🚀 Socket.IO server initialized");
  return io;
}

function getSocketIO() {
  return io;
}

module.exports = { initializeSocket, getSocketIO };
