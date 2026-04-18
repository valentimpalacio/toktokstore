const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      take: 5
    });
    
    console.log('=== PRODUCTS ===');
    products.forEach(p => {
      console.log(`\nName: ${p.name}`);
      console.log(`Image: ${p.image}`);
      console.log(`Category: ${p.category?.name}`);
    });
    
    const totalProducts = await prisma.product.count();
    console.log(`\n\n=== TOTAL PRODUCTS: ${totalProducts} ===`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
