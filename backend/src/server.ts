import express from "express";
import http from "http";
import { Server } from "socket.io";
import routes from "./routes/index.js";


export const startServer = () => {
  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: "*" }
  });

  app.use(express.json());
  app.use("/api", routes);

  app.get("/", (req, res) => {
    res.send("AmbuCast backend running");
  });

  io.on("connection", (socket) => {
    console.log("Client connected");
  });

  server.listen(3000, () => {
    console.log("Server running on port 3000");
  });
};