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

// Get a single job
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const job = await prisma.job.findUnique({
      where: { id: Number(id) },
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
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a job
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, date, statusId, serviceTypeId, items } = req.body;
  try {
    const job = await prisma.$transaction(async (prisma) => {
      // 1. Get existing job with items to restore stock
      const existingJob = await prisma.job.findUnique({
        where: { id: Number(id) },
        include: {
          itemsUsed: true
        }
      });

      if (!existingJob) {
        throw new Error('Job not found');
      }

      // 2. Restore stock for old items
      for (const oldItem of existingJob.itemsUsed) {
        await prisma.inventoryItem.update({
          where: { id: oldItem.itemId },
          data: {
            stock: {
              increment: oldItem.quantity
            }
          }
        });
      }

      // 3. Validate stock availability for new items
      if (items && items.length > 0) {
        for (const item of items) {
          const inventoryItem = await prisma.inventoryItem.findUnique({
            where: { id: Number(item.itemId) }
          });
          
          if (!inventoryItem) {
            throw new Error(`Item with ID ${item.itemId} not found`);
          }
          
          if (inventoryItem.stock < Number(item.quantity)) {
            throw new Error(`Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.stock}, Requested: ${item.quantity}`);
          }
        }
      }

      // 4. Update job details
      const updatedJob = await prisma.job.update({
        where: { id: Number(id) },
        data: {
          title,
          description,
          date: new Date(date),
          statusId: Number(statusId),
          serviceTypeId: Number(serviceTypeId),
        }
      });

      // 5. Delete existing items
      await prisma.jobItem.deleteMany({
        where: { jobId: Number(id) }
      });

      // 6. Create new items and decrement stock
      if (items && items.length > 0) {
        await prisma.jobItem.createMany({
          data: items.map(item => ({
            jobId: Number(id),
            itemId: Number(item.itemId),
            quantity: Number(item.quantity)
          }))
        });

        // Decrement stock for new items
        for (const item of items) {
          await prisma.inventoryItem.update({
            where: { id: Number(item.itemId) },
            data: {
              stock: {
                decrement: Number(item.quantity)
              }
            }
          });
        }
      }

      return updatedJob;
    });

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a job
router.post('/', async (req, res) => {
  const { title, description, date, statusId, serviceTypeId, items } = req.body;
  try {
    const job = await prisma.$transaction(async (prisma) => {
      // 1. Validate stock availability for all items
      if (items && items.length > 0) {
        for (const item of items) {
          const inventoryItem = await prisma.inventoryItem.findUnique({
            where: { id: Number(item.itemId) }
          });
          
          if (!inventoryItem) {
            throw new Error(`Item with ID ${item.itemId} not found`);
          }
          
          if (inventoryItem.stock < Number(item.quantity)) {
            throw new Error(`Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.stock}, Requested: ${item.quantity}`);
          }
        }
      }

      // 2. Create the job
      const newJob = await prisma.job.create({
        data: {
          title,
          description,
          date: new Date(date),
          statusId: Number(statusId),
          serviceTypeId: Number(serviceTypeId),
          itemsUsed: {
            create: items.map(item => ({
              item: { connect: { id: Number(item.itemId) } },
              quantity: Number(item.quantity)
            }))
          }
        }
      });

      // 3. Decrement stock for each item used
      if (items && items.length > 0) {
        for (const item of items) {
          await prisma.inventoryItem.update({
            where: { id: Number(item.itemId) },
            data: {
              stock: {
                decrement: Number(item.quantity)
              }
            }
          });
        }
      }

      return newJob;
    });

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
