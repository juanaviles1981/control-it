import express from "express";
import { prisma } from "../server.js";

const router = express.Router();

// Get all equipment
router.get("/", async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany({
      include: {
        sector: true,
      },
    });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: "Error fetching equipment" });
  }
});

// Create new equipment
router.post("/", async (req, res) => {
  const { name, anydeskNumber, computerType, sectorId } = req.body;
  try {
    const newEquipment = await prisma.equipment.create({
      data: {
        name,
        anydeskNumber,
        computerType,
        sectorId: parseInt(sectorId),
        connectionType: req.body.connectionType,
        connectionDetails: req.body.connectionDetails,
      },
    });
    res.json(newEquipment);
  } catch (error) {
    res.status(500).json({ error: "Error creating equipment" });
  }
});

// Update equipment
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, anydeskNumber, computerType, sectorId } = req.body;
  try {
    const updatedEquipment = await prisma.equipment.update({
      where: { id: parseInt(id) },
      data: {
        name,
        anydeskNumber,
        computerType,
        sectorId: parseInt(sectorId),
        connectionType: req.body.connectionType,
        connectionDetails: req.body.connectionDetails,
      },
    });
    res.json(updatedEquipment);
  } catch (error) {
    res.status(500).json({ error: "Error updating equipment" });
  }
});

// Delete equipment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.equipment.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Equipment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting equipment" });
  }
});

export default router;
