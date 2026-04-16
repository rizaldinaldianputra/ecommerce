const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Clean up existing data (optional, but good for fresh starts)
  // await prisma.productImage.deleteMany();
  // await prisma.productVariant.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();

  // 2. Create Categories
  const apparel = await prisma.category.upsert({
    where: { slug: 'apparel' },
    update: {},
    create: {
      name: 'Apparel',
      slug: 'apparel',
      description: 'Fashionable clothing for all seasons',
      imageUrl: '/images/categories/apparel.jpg',
      isActive: true,
    },
  });

  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest gadgets and tech',
      imageUrl: '/images/categories/electronics.jpg',
      isActive: true,
    },
  });

  // 3. Create Products
  const hoodie = await prisma.product.upsert({
    where: { slug: 'classic-hoodie' },
    update: {},
    create: {
      name: 'Classic Black Hoodie',
      slug: 'classic-hoodie',
      description: 'A comfortable and stylish black hoodie made from 100% cotton.',
      shortDescription: 'Essential black hoodie.',
      isActive: true,
      isFeatured: true,
      gender: 'UNISEX',
      categoryId: apparel.id,
      variants: {
        create: [
          {
            sku: 'HOODIE-BLK-S',
            size: 'S',
            color: 'Black',
            price: 299000,
            stock: 50,
          },
          {
            sku: 'HOODIE-BLK-M',
            size: 'M',
            color: 'Black',
            price: 299000,
            stock: 75,
          },
          {
            sku: 'HOODIE-BLK-L',
            size: 'L',
            color: 'Black',
            price: 299000,
            stock: 30,
          },
        ],
      },
      images: {
        create: [
          {
            url: '/images/products/hoodie-black-front.jpg',
            isPrimary: true,
            displayOrder: 1,
          },
          {
            url: '/images/products/hoodie-black-back.jpg',
            isPrimary: false,
            displayOrder: 2,
          },
        ],
      },
    },
  });

  const smartphone = await prisma.product.upsert({
    where: { slug: 'zelixa-phone-v1' },
    update: {},
    create: {
      name: 'Zelixa Phone V1',
      slug: 'zelixa-phone-v1',
      description: 'The first flagship smartphone from Zelixa with advanced features.',
      shortDescription: 'High-end smartphone.',
      isActive: true,
      isTopProduct: true,
      categoryId: electronics.id,
      variants: {
        create: [
          {
            sku: 'ZPH-64GB-SLV',
            size: '64GB',
            color: 'Silver',
            price: 5999000,
            stock: 20,
          },
          {
            sku: 'ZPH-128GB-GRY',
            size: '128GB',
            color: 'Space Grey',
            price: 6999000,
            stock: 15,
          },
        ],
      },
      images: {
        create: [
          {
            url: '/images/products/phone-v1.jpg',
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
