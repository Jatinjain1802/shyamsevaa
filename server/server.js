import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import "./src/config/db.js";
import { startWhatsappWorker } from "./src/utils/whatsappQueue.js";

const PORT = process.env.PORT || 7484;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust later for security
    methods: ["GET", "POST", "PUT"]
  }
});

// Attach io to app to access in controllers
app.set("io", io);
startWhatsappWorker(io);

io.on("connection", (socket) => {
  console.log("🟢 Live dev connected:", socket.id);
  
  socket.on("join-user-room", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their notification room`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Dev disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
