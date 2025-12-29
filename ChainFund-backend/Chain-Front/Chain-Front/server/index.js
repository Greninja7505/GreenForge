import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import projectRoutes from "./routes/projects.js";
import donationRoutes from "./routes/donations.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/chainfund",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "ChainFund API",
    version: "1.0.0",
    endpoints: {
      projects: "/api/projects",
      donations: "/api/donations",
      users: "/api/users",
    },
  });
});

app.use("/api/projects", projectRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/users", userRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
