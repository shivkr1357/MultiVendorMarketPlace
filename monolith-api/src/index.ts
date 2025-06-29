import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import paymentRoutes from "./routes/payments";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/marketplace";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Monolith API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`👥 User endpoints: http://localhost:${PORT}/api/users`);
      console.log(
        `📦 Product endpoints: http://localhost:${PORT}/api/products`
      );
      console.log(`📋 Order endpoints: http://localhost:${PORT}/api/orders`);
      console.log(
        `📋 Payment endpoints: http://localhost:${PORT}/api/payments`
      );
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed");
  process.exit(0);
});
