import express from "express";
import http from "http";
import { Server } from "socket.io";
import index from "./routes/index.js";
import cors from 'cors'

const port = process.env.PORT || 4001;
const app = express();

// Allow your Vercel frontend URL
const allowedOrigins = [
  process.env.FRONT_END_URL,
  "http://localhost:3000",
  "https://your-app.vercel.app" // Add your actual Vercel URL here
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(index);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
}); 

let intervals = new Map(); // Use Map to track intervals per socket

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  const interval = setInterval(() => getApiAndEmit(socket), 5000);
  intervals.set(socket.id, interval);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    const socketInterval = intervals.get(socket.id);
    if (socketInterval) {
      clearInterval(socketInterval);
      intervals.delete(socket.id);
    }
  });
});

function getApiAndEmit(socket) {
  const response = new Date();
  console.log("Emitting to client:", socket.id, response);
  socket.emit("FromAPI", response);
}

server.listen(port, () => console.log(`Listening on port ${port}`));