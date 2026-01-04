import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Database Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/goodnesseer";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

import postRoutes from "./routes/posts";
import reportRoutes from "./routes/reports";
import adminRoutes from "./routes/admin";

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Goodnesseer API is running");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
