import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Get all stock requests
router.get("/", async (req, res) => {
  try {
    const stockRequests = await prisma.stockRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(stockRequests);
  } catch (error) {
    console.error("Error fetching stock requests:", error);
    res.status(500).json({ error: "Failed to fetch stock requests" });
  }
});

// Create a new stock request
router.post("/", async (req, res) => {
  try {
    const { name, description, category, quantity, status } = req.body;

    const stockRequest = await prisma.stockRequest.create({
      data: {
        name,
        description,
        category,
        quantity: parseInt(quantity),
        status: status || "pending",
      },
    });

    res.status(201).json(stockRequest);
  } catch (error) {
    console.error("Error creating stock request:", error);
    res.status(500).json({ error: "Failed to create stock request" });
  }
});

// Update a stock request
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, quantity, status } = req.body;

    const stockRequest = await prisma.stockRequest.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        category,
        quantity: parseInt(quantity),
        status,
      },
    });

    res.json(stockRequest);
  } catch (error) {
    console.error("Error updating stock request:", error);
    res.status(500).json({ error: "Failed to update stock request" });
  }
});

// Delete a stock request
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.stockRequest.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Stock request deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock request:", error);
    res.status(500).json({ error: "Failed to delete stock request" });
  }
});

// Convert stock request to inventory item
router.post("/:id/convert", async (req, res) => {
  try {
    const { id } = req.params;

    // Get the stock request
    const stockRequest = await prisma.stockRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!stockRequest) {
      return res.status(404).json({ error: "Stock request not found" });
    }

    // Create inventory item
    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        name: stockRequest.name,
        description: stockRequest.description,
        category: stockRequest.category,
        stock: stockRequest.quantity,
        minStock: 5, // Default value
      },
    });

    // Delete the stock request
    await prisma.stockRequest.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      message: "Stock request converted to inventory item",
      inventoryItem,
    });
  } catch (error) {
    console.error("Error converting stock request:", error);
    res.status(500).json({ error: "Failed to convert stock request" });
  }
});

export default router;
