const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const result = await prisma.product.updateMany({
    where: { name: 'PowerDock Station' },
    data: {
      image: 'https://images.pexels.com/photos/1332766/pexels-photo-1332766.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  });
  console.log('Produtos atualizados:', result.count);
  await prisma.$disconnect();
}

fix().catch(e => {
  console.error('Erro:', e.message);
  process.exit(1);
});
