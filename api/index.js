import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// CORS config to allow frontend & cookies
app.use(
  cors({
    origin: "https://real-estate-website-five-mocha.vercel.app", // your frontend URL
    credentials: true, // allow cookies
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "hello world" });
});
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Error handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Connect to MongoDB and start server
const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_STRING_URL, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
