import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpiar datos existentes
  await prisma.inventoryMovement.deleteMany();
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios
  const hashedPasswordVendedor = await bcrypt.hash('12345', 10);
  const hashedPasswordAdmin = await bcrypt.hash('180305', 10);

  const vendedor = await prisma.user.create({
    data: {
      name: 'Vendedor',
      email: 'vendedor@genex.com',
      password: hashedPasswordVendedor,
      role: 'VENDEDOR',
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@genex.com',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuarios creados:');
  console.log('   👤 Vendedor - email: vendedor@genex.com - password: 12345');
  console.log('   👤 Admin - email: admin@genex.com - password: 180305');

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
