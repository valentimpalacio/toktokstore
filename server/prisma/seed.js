const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const electronics = await prisma.category.create({ data: { name: 'Electronics' } });
  const accessories = await prisma.category.create({ data: { name: 'Accessories' } });
  const audio = await prisma.category.create({ data: { name: 'Audio' } });
  const wearables = await prisma.category.create({ data: { name: 'Wearables' } });
  const gaming = await prisma.category.create({ data: { name: 'Gaming' } });
  const homeOffice = await prisma.category.create({ data: { name: 'Home Office' } });
  const photography = await prisma.category.create({ data: { name: 'Photography' } });

  // Create products
  const products = [
    {
      name: 'Quantum X1 Smartphone',
      description:
        'The future of mobile technology with neural processing, OLED 120Hz display, and 5000mAh battery. Features a 108MP triple camera system and 5G connectivity.',
      price: 999.99,
      stock: 50,
      image:
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800',
      categoryId: electronics.id,
    },
    {
      name: 'Nebula Laptop 14"',
      description:
        'Powerful performance in a slim aluminum body, featuring the latest M3 equivalent chip with 16GB unified memory and 512GB SSD.',
      price: 1299.99,
      stock: 0, // Out of stock to demonstrate UI
      image:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
      categoryId: electronics.id,
    },
    {
      name: 'UltraView 4K Monitor',
      description:
        'Professional 32-inch 4K monitor with HDR1000, 99% DCI-P3 color gamut, and USB-C connectivity. Perfect for creators.',
      price: 799.99,
      stock: 15,
      image:
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
      categoryId: electronics.id,
    },
    {
      name: 'AeroSound Pro',
      description:
        'Premium active noise cancelling headphones with 40-hour battery life, spatial audio, and adaptive EQ for personalized sound.',
      price: 299.99,
      stock: 100,
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      categoryId: audio.id,
    },
    {
      name: 'BassWave Speaker',
      description:
        'Portable Bluetooth speaker with 360-degree sound, IP67 waterproof rating, and 24-hour battery life.',
      price: 149.99,
      stock: 60,
      image:
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800',
      categoryId: audio.id,
    },
    {
      name: 'StudioMax Earbuds',
      description:
        'True wireless earbuds with hybrid ANC, Hi-Res audio codec support, and wireless charging case.',
      price: 179.99,
      stock: 80,
      image:
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=800',
      categoryId: audio.id,
    },
    {
      name: 'Titan Watch Series 5',
      description:
        'Rugged smartwatch with titanium body, satellite connectivity, advanced health monitoring, and 7-day battery life.',
      price: 499.99,
      stock: 30,
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      categoryId: wearables.id,
    },
    {
      name: 'Nexus VR Headset',
      description:
        'Next-generation mixed reality headset with 8K total resolution, eye tracking, and haptic controllers.',
      price: 1499.0,
      stock: 12,
      image:
        'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800',
      categoryId: electronics.id,
    },
    {
      name: 'Aura Gaming Mouse',
      description:
        'Ultra-lightweight wireless gaming mouse with 26000 DPI sensor, 70-hour battery, and customizable RGB lighting.',
      price: 79.99,
      stock: 120,
      image:
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
      categoryId: gaming.id,
    },
    {
      name: 'Vortex Mechanical Keyboard',
      description:
        'Mechanical keyboard with hot-swappable switches, per-key RGB sync technology, and aircraft-grade aluminum frame.',
      price: 189.99,
      stock: 3, // Low stock to demonstrate badge
      image:
        'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800',
      categoryId: gaming.id,
    },
    {
      name: 'Lumina RGB Pad',
      description:
        'Large scale desk mat with integrated RGB lighting zones and wireless charging for your mouse.',
      price: 45.0,
      stock: 200,
      image:
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800',
      categoryId: gaming.id,
    },
    {
      name: 'Zenith Standing Desk',
      description:
        'Electric height adjustable desk with memory presets, bamboo top, and integrated cable management.',
      price: 649.99,
      stock: 10,
      image:
        'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=800',
      categoryId: homeOffice.id,
    },
    {
      name: 'ErgoFlow Mesh Chair',
      description:
        'Premium ergonomic chair with adaptive lumbar support, 4D armrests, and breathable high-density mesh.',
      price: 399.0,
      stock: 25,
      image:
        'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=800',
      categoryId: homeOffice.id,
    },
    {
      name: 'Alpha A7 Mirrorless',
      description:
        'Full-frame mirrorless camera with 33MP sensor, 4K 60p recording, and advanced real-time autofocus.',
      price: 2499.99,
      stock: 5,
      image:
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
      categoryId: photography.id,
    },
    {
      name: 'CineLens 50mm f/1.2',
      description:
        'Ultra-fast prime lens with incredible bokeh and sharpness, optimized for high-resolution sensors.',
      price: 1899.0,
      stock: 8,
      image:
        'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=800',
      categoryId: photography.id,
    },
    {
      name: 'GlidePro Gimbal',
      description:
        '3-axis stabilizer for mirrorless cameras with 3.0kg payload and integrated RavenEye transmission system.',
      price: 349.99,
      stock: 0, // Out of stock
      image:
        'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&q=80&w=800',
      categoryId: photography.id,
    },
    {
      name: 'TechPro Backpack',
      description:
        'Water-resistant backpack with dedicated laptop compartment (up to 16"), USB charging port, and RFID protection pocket.',
      price: 89.99,
      stock: 90,
      image:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      categoryId: accessories.id,
    },
    {
      name: 'PowerDock Station',
      description:
        '3-in-1 wireless charging station for phone, watch, and earbuds. Supports 15W fast charging with LED indicator.',
      price: 59.99,
      stock: 150,
      image:
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=800',
      categoryId: accessories.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // Create an admin user
  const bcrypt = require('bcryptjs');
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@toktokstore.com',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log(`Seeded ${products.length} products, 7 categories, and 1 admin user`);
  console.log('Admin credentials: admin@toktokstore.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
