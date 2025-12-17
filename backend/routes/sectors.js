import express from "express";
import { prisma } from "../server.js";

const router = express.Router();

// Get all sectors
router.get("/", async (req, res) => {
  try {
    const sectors = await prisma.sector.findMany({
      include: {
        equipment: true,
      },
    });
    res.json(sectors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sectors" });
  }
});

// Create a new sector
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const newSector = await prisma.sector.create({
      data: {
        name,
        rack: req.body.rack,
      },
    });
    res.json(newSector);
  } catch (error) {
    res.status(500).json({ error: "Error creating sector" });
  }
});

// Update a sector
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedSector = await prisma.sector.update({
      where: { id: parseInt(id) },
      data: {
        name,
        rack: req.body.rack,
      },
    });
    res.json(updatedSector);
  } catch (error) {
    res.status(500).json({ error: "Error updating sector" });
  }
});

// Delete a sector
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.sector.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Sector deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting sector" });
  }
});

export default router;
