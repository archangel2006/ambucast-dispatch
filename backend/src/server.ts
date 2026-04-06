import express from "express";
import http from "http";
import { initSocket } from "./sockets/socket.js";
import routes from "./routes/index.js";

export const startServer = () => {
  const app = express();
  const server = http.createServer(app);

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