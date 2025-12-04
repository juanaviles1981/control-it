import express from "express";
import { prisma } from "../server.js";

const router = express.Router();

// Get inventory
router.get("/", async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item
router.post("/", async (req, res) => {
  const { name, description, category, stock, minStock } = req.body;
  try {
    const item = await prisma.inventoryItem.create({
      data: {
        name,
        description,
        category,
        stock: Number(stock),
        minStock: Number(minStock),
      },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item is used in any jobs
    const jobItems = await prisma.jobItem.findMany({
      where: { itemId: parseInt(id) },
    });

    if (jobItems.length > 0) {
      return res.status(400).json({
        error:
          "No se puede eliminar este ítem porque está asociado a trabajos existentes",
      });
    }

    await prisma.inventoryItem.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Ítem eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
