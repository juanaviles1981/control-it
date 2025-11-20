import express from 'express';
import { prisma } from '../server.js';

const router = express.Router();

// Get inventory
router.get('/', async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item
router.post('/', async (req, res) => {
  const { name, description, category, stock, minStock } = req.body;
  try {
    const item = await prisma.inventoryItem.create({
      data: {
        name,
        description,
        category,
        stock: Number(stock),
        minStock: Number(minStock)
      }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
