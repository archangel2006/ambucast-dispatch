import express from "express";
import http from "http";
import cors from "cors";
import { initSocket } from "./sockets/socket.js";
import routes from "./routes/index.js";

export const startServer = () => {
  const app = express();
  const server = http.createServer(app);

  // CORS configuration — supports localhost for dev + env-configured origins for production
  // CORS_ORIGIN env var can be comma-separated: https://myapp.vercel.app,https://myapp2.onrender.com
  const envOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
    : [];

  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    ...envOrigins,
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("CORS policy: origin not allowed"));
      }
    },
    credentials: true,
  }));

  initSocket(server);

  app.use(express.json());
  app.use("/api", routes);

  app.get("/", (_req, res) => {
    res.send("AmbuCast backend running");
  });

  // Use PORT from env (Render injects this) or default to 3001
  const PORT = parseInt(process.env.PORT || "3001", 10);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};