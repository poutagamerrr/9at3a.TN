import Product from '../models/Product.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  // LCD Screens
  {
    name: 'Samsung Galaxy S21 LCD Display',
    category: 'LCD Screen',
    description: 'Original quality Samsung Galaxy S21 AMOLED display with digitizer',
    images: ['https://via.placeholder.com/300?text=Samsung+S21+LCD'],
    specifications: {
      compatible_models: ['Samsung Galaxy S21', 'Samsung Galaxy S21+'],
      color: 'Black',
      other: 'Original AMOLED, Full HD+ resolution',
    },
    stockQuantity: 45,
    pricing: {
      admin_price: 85,
      customer_price: 120,
      vip_customer_price: 105,
    },
  },
  {
    name: 'iPhone 13 Pro LCD Display',
    category: 'LCD Screen',
    description: 'High-quality iPhone 13 Pro OLED Retina display with True Tone',
    images: ['https://via.placeholder.com/300?text=iPhone+13+LCD'],
    specifications: {
      compatible_models: ['iPhone 13 Pro', 'iPhone 13 Pro Max'],
      color: 'Black',
      other: 'OLED Super Retina XDR, 120Hz ProMotion',
    },
    stockQuantity: 38,
    pricing: {
      admin_price: 95,
      customer_price: 135,
      vip_customer_price: 118,
    },
  },
  {
    name: 'Xiaomi Redmi Note 11 LCD Display',
    category: 'LCD Screen',
    description: 'Xiaomi Redmi Note 11 IPS LCD screen with full touch panel',
    images: ['https://via.placeholder.com/300?text=Xiaomi+Note+11+LCD'],
    specifications: {
      compatible_models: ['Xiaomi Redmi Note 11', 'Xiaomi Redmi Note 11 Pro'],
      color: 'Black',
      other: '2400x1080 FHD+ resolution, 90Hz refresh rate',
    },
    stockQuantity: 52,
    pricing: {
      admin_price: 35,
      customer_price: 50,
      vip_customer_price: 43,
    },
  },
  {
    name: 'OnePlus 10 Pro AMOLED Display',
    category: 'LCD Screen',
    description: 'OnePlus 10 Pro AMOLED curved display with Corning Gorilla Glass',
    images: ['https://via.placeholder.com/300?text=OnePlus+10+LCD'],
    specifications: {
      compatible_models: ['OnePlus 10 Pro'],
      color: 'Black',
      other: '120Hz AMOLED, QHD+ resolution',
    },
    stockQuantity: 28,
    pricing: {
      admin_price: 88,
      customer_price: 125,
      vip_customer_price: 109,
    },
  },

  // Batteries
  {
    name: 'Samsung Galaxy S21 Battery',
    category: 'Battery',
    description: 'Original Samsung Galaxy S21 Li-ion rechargeable battery 4000mAh',
    images: ['https://via.placeholder.com/300?text=Samsung+S21+Battery'],
    specifications: {
      compatible_models: ['Samsung Galaxy S21'],
      color: 'Black',
      other: '4000mAh, Li-ion, 25W fast charging',
    },
    stockQuantity: 65,
    pricing: {
      admin_price: 25,
      customer_price: 40,
      vip_customer_price: 34,
    },
  },
  {
    name: 'iPhone 13 Pro Battery',
    category: 'Battery',
    description: 'Original iPhone 13 Pro Li-ion battery with high cycle count',
    images: ['https://i.pinimg.com/1200x/e9/d3/ba/e9d3ba38950dbea8e1f410ac0cc6eb97.jpg'],
    specifications: {
      compatible_models: ['iPhone 13 Pro', 'iPhone 13 Pro Max'],
      color: 'Black',
      other: '3095mAh/3240mAh, Li-ion, supports 20W charging',
    },
    stockQuantity: 58,
    pricing: {
      admin_price: 35,
      customer_price: 55,
      vip_customer_price: 47,
    },
  },
  {
    name: 'Xiaomi Redmi Note 11 Battery',
    category: 'Battery',
    description: 'High-capacity Xiaomi Redmi Note 11 Li-ion battery 5000mAh',
    images: ['https://via.placeholder.com/300?text=Xiaomi+Note+11+Battery'],
    specifications: {
      compatible_models: ['Xiaomi Redmi Note 11', 'Xiaomi Redmi Note 11 Pro'],
      color: 'Black',
      other: '5000mAh, Li-ion, 33W fast charging capable',
    },
    stockQuantity: 72,
    pricing: {
      admin_price: 18,
      customer_price: 28,
      vip_customer_price: 24,
    },
  },
  {
    name: 'OnePlus 10 Pro Battery',
    category: 'Battery',
    description: 'OnePlus 10 Pro dual-cell Li-ion battery 5000mAh',
    images: ['https://via.placeholder.com/300?text=OnePlus+10+Battery'],
    specifications: {
      compatible_models: ['OnePlus 10 Pro'],
      color: 'Black',
      other: '5000mAh, Dual-cell Li-ion, 80W charging support',
    },
    stockQuantity: 44,
    pricing: {
      admin_price: 32,
      customer_price: 50,
      vip_customer_price: 42,
    },
  },

  // Sub-boards
  {
    name: 'Samsung Galaxy S21 Charging Port Board',
    category: 'Sub-board',
    description: 'USB-C charging port with charging module and flex connector',
    images: ['https://via.placeholder.com/300?text=Samsung+S21+Board'],
    specifications: {
      compatible_models: ['Samsung Galaxy S21'],
      color: 'Black',
      other: 'USB Type-C, includes micro connector',
    },
    stockQuantity: 35,
    pricing: {
      admin_price: 28,
      customer_price: 45,
      vip_customer_price: 38,
    },
  },
  {
    name: 'iPhone 13 Logic Board Components',
    category: 'Sub-board',
    description: 'EMMC storage module and control board components',
    images: ['https://via.placeholder.com/300?text=iPhone+13+Board'],
    specifications: {
      compatible_models: ['iPhone 13 Pro'],
      color: 'Black',
      other: 'Compatible with A15 Bionic processor',
    },
    stockQuantity: 18,
    pricing: {
      admin_price: 120,
      customer_price: 180,
      vip_customer_price: 155,
    },
  },
  {
    name: 'Xiaomi Redmi Note 11 USB Board',
    category: 'Sub-board',
    description: 'USB Type-C charging board with audio jack connector',
    images: ['https://via.placeholder.com/300?text=Xiaomi+Note+11+Board'],
    specifications: {
      compatible_models: ['Xiaomi Redmi Note 11'],
      color: 'Black',
      other: 'USB Type-C with audio connector',
    },
    stockQuantity: 42,
    pricing: {
      admin_price: 15,
      customer_price: 25,
      vip_customer_price: 21,
    },
  },
  {
    name: 'OnePlus 10 Pro Power Board',
    category: 'Sub-board',
    description: 'Power management and charging control board',
    images: ['https://via.placeholder.com/300?text=OnePlus+10+Board'],
    specifications: {
      compatible_models: ['OnePlus 10 Pro'],
      color: 'Black',
      other: 'Supports 80W SuperVOOC charging',
    },
    stockQuantity: 22,
    pricing: {
      admin_price: 45,
      customer_price: 70,
      vip_customer_price: 59,
    },
  },

  // Flex Cables (FPC)
  {
    name: 'Samsung Galaxy S21 Home Button Flex Cable',
    category: 'FPC',
    description: 'Fingerprint sensor and home button flex cable assembly',
    images: ['https://via.placeholder.com/300?text=Samsung+S21+FPC'],
    specifications: {
      compatible_models: ['Samsung Galaxy S21'],
      color: 'Black',
      other: 'Includes fingerprint sensor connector',
    },
    stockQuantity: 48,
    pricing: {
      admin_price: 12,
      customer_price: 20,
      vip_customer_price: 17,
    },
  },
  {
    name: 'iPhone 13 Pro Camera Flex Cable',
    category: 'FPC',
    description: 'Main camera module flex cable with connector',
    images: ['https://via.placeholder.com/300?text=iPhone+13+FPC'],
    specifications: {
      compatible_models: ['iPhone 13 Pro', 'iPhone 13 Pro Max'],
      color: 'Black',
      other: 'Triple camera compatible',
    },
    stockQuantity: 35,
    pricing: {
      admin_price: 18,
      customer_price: 30,
      vip_customer_price: 25,
    },
  },
  {
    name: 'Xiaomi Redmi Note 11 Display Flex',
    category: 'FPC',
    description: 'Display connector flex cable for LCD panel',
    images: ['https://via.placeholder.com/300?text=Xiaomi+Note+11+FPC'],
    specifications: {
      compatible_models: ['Xiaomi Redmi Note 11'],
      color: 'Black',
      other: 'Standard, high-quality connector',
    },
    stockQuantity: 61,
    pricing: {
      admin_price: 8,
      customer_price: 14,
      vip_customer_price: 12,
    },
  },
  {
    name: 'OnePlus 10 Pro Motherboard Flex Cable',
    category: 'FPC',
    description: 'Main motherboard interconnect flex cable',
    images: ['https://via.placeholder.com/300?text=OnePlus+10+FPC'],
    specifications: {
      compatible_models: ['OnePlus 10 Pro'],
      color: 'Black',
      other: 'High reliability for main connections',
    },
    stockQuantity: 28,
    pricing: {
      admin_price: 14,
      customer_price: 24,
      vip_customer_price: 20,
    },
  },
  {
    name: 'Samsung Galaxy S21 Battery Connector Flex',
    category: 'FPC',
    description: 'Battery connector flex cable assembly',
    images: ['https://via.placeholder.com/300?text=Samsung+S21+Bat+FPC'],
    specifications: {
      compatible_models: ['Samsung Galaxy S21', 'Samsung Galaxy S21+'],
      color: 'Black',
      other: 'Safe and durable connector',
    },
    stockQuantity: 55,
    pricing: {
      admin_price: 6,
      customer_price: 12,
      vip_customer_price: 10,
    },
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/9at3aTN');
    console.log('MongoDB connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');

    // Insert new products
    const inserted = await Product.insertMany(products);
    console.log(`${inserted.length} products seeded successfully!`);

    // Display summary
    const categories = {};
    inserted.forEach((p) => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    console.log('\nProducts by category:', categories);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding products:', err.message);
    process.exit(1);
  }
};

seedProducts();
