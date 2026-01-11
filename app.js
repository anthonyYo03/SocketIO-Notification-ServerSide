import express from "express";
import http from "http";
import { Server } from "socket.io";
import index from "./routes/index.js";
import  cors from 'cors'
const port = process.env.PORT || 4001;
const app = express();
app.use(cors({
  origin: process.env.FRONT_END_URL || "http://localhost:3000",
  methods: ["GET", "POST"]
}));
app.use(index);

 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_END_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
}); 

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => getApiAndEmit(socket), 5000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

function getApiAndEmit(socket) {
  const response = new Date();
  socket.emit("FromAPI", response);
}

server.listen(port, () => console.log(`Listening on port ${port}`));
