import express from "express";
import { prisma } from "../server.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [
      totalJobs,
      jobsByStatus,
      jobsByProblemType,
      jobsByServiceType,
      totalInventoryItems,
      lowStockItems,
      totalEquipment,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.job.groupBy({
        by: ["statusId"],
        _count: {
          statusId: true,
        },
      }),
      prisma.job.groupBy({
        by: ["problemType"],
        _count: {
          problemType: true,
        },
      }),
      prisma.job.groupBy({
        by: ["serviceTypeId"],
        _count: {
          serviceTypeId: true,
        },
      }),
      prisma.inventoryItem.count(),
      prisma.inventoryItem.count({
        where: {
          stock: {
            lte: 5, // Assuming 5 is the low stock threshold
          },
        },
      }),
      prisma.equipment.count(),
    ]);

    // Fetch names for statuses and service types
    const statuses = await prisma.status.findMany();
    const serviceTypes = await prisma.serviceType.findMany();

    const formattedJobsByStatus = jobsByStatus.map((item) => ({
      name: statuses.find((s) => s.id === item.statusId)?.name || "Unknown",
      value: item._count.statusId,
    }));

    const formattedJobsByProblemType = jobsByProblemType.map((item) => ({
      name: item.problemType || "Sin Clasificar",
      value: item._count.problemType,
    }));

    const formattedJobsByServiceType = jobsByServiceType.map((item) => ({
      name:
        serviceTypes.find((s) => s.id === item.serviceTypeId)?.name ||
        "Unknown",
      value: item._count.serviceTypeId,
    }));

    res.json({
      totalJobs,
      jobsByStatus: formattedJobsByStatus,
      jobsByProblemType: formattedJobsByProblemType,
      jobsByServiceType: formattedJobsByServiceType,
      inventory: {
        totalItems: totalInventoryItems,
        lowStockItems,
      },
      equipment: {
        total: totalEquipment,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Error fetching statistics" });
  }
});

export default router;
