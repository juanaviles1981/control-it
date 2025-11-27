import express from 'express';
import { prisma } from '../server.js';

const router = express.Router();

// Get all statuses
router.get('/statuses', async (req, res) => {
  try {
    const statuses = await prisma.status.findMany();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all service types
router.get('/service-types', async (req, res) => {
  try {
    const serviceTypes = await prisma.serviceType.findMany();
    res.json(serviceTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
