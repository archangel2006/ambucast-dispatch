import express from "express";
import http from "http";
import cors from "cors";
import { initSocket } from "./sockets/socket.js";
import routes from "./routes/index.js";

export const startServer = () => {
  const app = express();
  const server = http.createServer(app);

  // CORS configuration
  app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }));

  initSocket(server);

  app.use(express.json());
  app.use("/api", routes);

  app.get("/", (_req, res) => {
    res.send("AmbuCast backend running");
  });

  server.listen(3001, () => {
    console.log("Server running on port 3001");
  });
};