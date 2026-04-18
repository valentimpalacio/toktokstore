// server/prisma/seed.ts - Sample seed data
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      description: "Electronic devices and gadgets",
    },
  });

  const accessories = await prisma.category.create({
    data: {
      name: "Accessories",
      description: "Accessories and add-ons",
    },
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: "Wireless Headphones",
        price: 2999,
        stock: 50,
        description: "Premium wireless headphones with noise cancellation",
        categoryId: electronics.id,
        image: "https://via.placeholder.com/400x400",
      },
      {
        name: "Smart Watch",
        price: 4999,
        stock: 30,
        description: "Advanced smartwatch with health tracking",
        categoryId: electronics.id,
        image: "https://via.placeholder.com/400x400",
      },
      {
        name: "Phone Case",
        price: 499,
        stock: 100,
        description: "Protective phone case with premium design",
        categoryId: accessories.id,
        image: "https://via.placeholder.com/400x400",
      },
      {
        name: "USB Cable",
        price: 299,
        stock: 200,
        description: "Fast charging USB-C cable",
        categoryId: accessories.id,
        image: "https://via.placeholder.com/400x400",
      },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
