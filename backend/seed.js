import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Seed Statuses
    const statuses = ['Pendiente', 'En Progreso', 'Completado', 'Cancelado'];
    for (const name of statuses) {
      await prisma.status.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    console.log('Statuses seeded.');

    // Seed Service Types
    const serviceTypes = ['Mantenimiento', 'Reparación', 'Instalación', 'Consultoría'];
    for (const name of serviceTypes) {
      await prisma.serviceType.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    console.log('Service Types seeded.');

    // Seed Inventory Items
    const inventoryItems = [
      { name: 'Cable UTP Cat6', description: 'Cable de red por metro', category: 'Redes', stock: 500, minStock: 50 },
      { name: 'Conector RJ45', description: 'Conector para cable de red', category: 'Redes', stock: 200, minStock: 20 },
      { name: 'Disco SSD 500GB', description: 'Disco estado sólido', category: 'Hardware', stock: 10, minStock: 2 },
      { name: 'Memoria RAM 8GB', description: 'DDR4 3200MHz', category: 'Hardware', stock: 15, minStock: 5 },
      { name: 'Mouse Óptico', description: 'Mouse USB básico', category: 'Periféricos', stock: 30, minStock: 5 },
    ];

    for (const item of inventoryItems) {
      // Check if exists to avoid duplicates (naive check by name)
      const existing = await prisma.inventoryItem.findFirst({ where: { name: item.name } });
      if (!existing) {
        await prisma.inventoryItem.create({ data: item });
      }
    }
    console.log('Inventory Items seeded.');

    // Seed default admin user
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('admin123', 10);
    
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          email: 'admin@control-it.com',
          role: 'admin'
        }
      });
      console.log('Default admin user created (username: admin, password: admin123)');
    }


  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
