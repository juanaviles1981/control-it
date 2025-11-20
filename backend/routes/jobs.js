import express from 'express';
import { prisma } from '../server.js';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        status: true,
        serviceType: true,
        itemsUsed: {
          include: {
            item: true
          }
        }
      }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a job
router.post('/', async (req, res) => {
  const { title, description, date, statusId, serviceTypeId, items } = req.body;
  try {
    const job = await prisma.job.create({
      data: {
        title,
        description,
        date: new Date(date),
        statusId: Number(statusId),
        serviceTypeId: Number(serviceTypeId),
        itemsUsed: {
          create: items.map(item => ({
            item: { connect: { id: item.itemId } },
            quantity: item.quantity
          }))
        }
      }
    });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
