import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./models/Product"; // Adjust the import path as needed

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/marketplace";

const productNames = [
  "Wireless Bluetooth Headphones",
  "Smart Fitness Watch",
  "Organic Cotton T-Shirt",
  "Stainless Steel Water Bottle",
  "LED Desk Lamp",
  "Portable Bluetooth Speaker",
  "Wireless Charging Pad",
  "Smartphone Case",
  "Laptop Stand",
  "USB-C Cable",
  "Wireless Mouse",
  "Mechanical Keyboard",
  "Gaming Headset",
  "Webcam HD",
  "External Hard Drive",
  "Coffee Maker",
  "Fitness Tracker",
  "Bluetooth Earbuds",
  "Smart Light Bulb",
  "Robot Vacuum",
];

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports & Outdoors",
  "Beauty & Health",
  "Toys & Games",
  "Automotive",
  "Food & Beverages",
  "Jewelry & Watches",
];

function getPicsumImages(index: number): string[] {
  return [
    `https://picsum.photos/400/300?random=${index * 3}`,
    `https://picsum.photos/400/300?random=${index * 3 + 1}`,
    `https://picsum.photos/400/300?random=${index * 3 + 2}`,
  ];
}

async function seedProducts() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  await Product.deleteMany({});
  console.log("🗑️  Cleared products collection");

  const products = [];

  for (let i = 0; i < 100; i++) {
    const name = productNames[i % productNames.length];
    const images = getPicsumImages(i);
    const category = categories[i % categories.length];
    const price = Math.floor(Math.random() * 300) + 30;
    const stock = Math.floor(Math.random() * 50) + 10;

    const product = new Product({
      name: `${name} ${i + 1}`,
      description: `${name} - High quality and reliable.`,
      price,
      category,
      vendorId: new mongoose.Types.ObjectId(),
      images,
      stock,
      isActive: true,
      tags: ["new"],
      rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 100),
    });

    products.push(product);
  }

  await Product.insertMany(products);
  console.log(
    `📦 Seeded ${products.length} products with reliable Lorem Picsum images.`
  );
  await mongoose.disconnect();
  console.log("✅ Disconnected from MongoDB");
}

if (require.main === module) {
  seedProducts().catch((err) => {
    console.error("❌ Error seeding products:", err);
    process.exit(1);
  });
}
