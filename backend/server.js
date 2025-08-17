import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import bcrypt from "bcryptjs";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import auth from "./routes/auth.js";
import { verifyRoute } from "./middlewares/verification.js";
import { socketHandler } from "./socket/socketHandler.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT;

const app = express();
const server = createServer(app); // HTTP server for socket.io

// Create socket.io instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", auth);

// Socket handler
socketHandler(io);

// Start server with socket.io
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
