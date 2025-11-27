import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jobRoutes from './routes/jobs.js';
import inventoryRoutes from './routes/inventory.js';
import metaRoutes from './routes/meta.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('IT Service Management API is running');
});

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/meta', metaRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { prisma };
