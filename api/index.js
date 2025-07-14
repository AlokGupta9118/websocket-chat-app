// api/index.js
import { Server } from "socket.io";

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔌 Starting Socket.IO server...");
    
    io = new Server(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("🟢 New user connected");

      socket.on("chat message", (msg) => {
        console.log("💬 Message received:", msg);
        io.emit("chat message", msg);
      });

      socket.on("disconnect", () => {
        console.log("🔴 User disconnected");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("✅ Socket.IO server already running");
  }

  res.end();
}
