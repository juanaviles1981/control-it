import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import jobRoutes from "./routes/jobs.js";
import inventoryRoutes from "./routes/inventory.js";
import metaRoutes from "./routes/meta.js";
import authRoutes from "./routes/auth.js";
import stockRequestRoutes from "./routes/stockRequests.js";
import sectorRoutes from "./routes/sectors.js";
import equipmentRoutes from "./routes/equipment.js";
import statsRoutes from "./routes/stats.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("IT Service Management API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", authMiddleware, jobRoutes);
app.use("/api/inventory", authMiddleware, inventoryRoutes);
app.use("/api/meta", authMiddleware, metaRoutes);
app.use("/api/stock-requests", authMiddleware, stockRequestRoutes);
app.use("/api/sectors", authMiddleware, sectorRoutes);
app.use("/api/equipment", authMiddleware, equipmentRoutes);
app.use("/api/stats", authMiddleware, statsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { prisma };
