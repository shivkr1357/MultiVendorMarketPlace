import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { User } from "./models/User";
import { Product } from "./models/Product";
import { Order } from "./models/Order";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/marketplace";

// Sample data arrays
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
];

// Function to generate unique images for a product
function generateProductImages(productName: string, index: number): string[] {
  const images = [];
  const imageCount = faker.number.int({ min: 3, max: 5 });

  for (let i = 0; i < imageCount; i++) {
    const imageService = faker.helpers.arrayElement([
      "picsum",
      "placeholder",
      "dummyimage",
    ]);

    let imageUrl: string;

    switch (imageService) {
      case "picsum":
        const picsumId = faker.number.int({ min: 1, max: 1000 });
        imageUrl = `https://picsum.photos/id/${picsumId}/400/300`;
        break;
      case "placeholder":
        const colors = ["f0f0f0", "e0e0e0", "d0d0d0", "c0c0c0", "b0b0b0"];
        const color = faker.helpers.arrayElement(colors);
        const category = faker.helpers.arrayElement(categories);
        imageUrl = `https://via.placeholder.com/400x300/${color}/666666?text=${category}+${
          index + 1
        }`;
        break;
      case "dummyimage":
        const dummyId = faker.number.int({ min: 1, max: 1000 });
        const dummyCategory = faker.helpers.arrayElement(categories);
        imageUrl = `https://dummyimage.com/400x300/cccccc/666666&text=${dummyCategory}+${dummyId}`;
        break;
      default:
        const fallbackCategory = faker.helpers.arrayElement(categories);
        imageUrl = `https://via.placeholder.com/400x300/f0f0f0/666666?text=${fallbackCategory}+${
          index + 1
        }`;
    }

    images.push(imageUrl);
  }

  return images;
}

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

async function clearDatabase() {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("🗑️  Database cleared");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
  }
}

async function seedUsers() {
  const users = [];

  // Create admin user
  const adminUser = new User({
    email: "admin@marketplace.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    permissions: ["read", "write", "delete", "admin"],
    isActive: true,
    isEmailVerified: true,
  });
  users.push(adminUser);

  // Create vendor users
  for (let i = 0; i < 5; i++) {
    const vendor = new User({
      email: faker.internet.email(),
      password: "vendor123",
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: "vendor",
      permissions: ["read", "write"],
      isActive: true,
      isEmailVerified: true,
    });
    users.push(vendor);
  }

  // Create customer users
  for (let i = 0; i < 20; i++) {
    const customer = new User({
      email: faker.internet.email(),
      password: "customer123",
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: "customer",
      permissions: ["read"],
      isActive: true,
      isEmailVerified: true,
    });
    users.push(customer);
  }

  const savedUsers = await User.insertMany(users);
  console.log(`👥 Created ${savedUsers.length} users`);
  return savedUsers;
}

async function seedProducts(vendors: any[]) {
  const products = [];
  const vendorIds = vendors
    .filter((user) => user.role === "vendor")
    .map((user) => user._id);

  for (let i = 0; i < 50; i++) {
    const product = new Product({
      name: faker.helpers.arrayElement(productNames),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
      category: faker.helpers.arrayElement(categories),
      vendorId: faker.helpers.arrayElement(vendorIds),
      images: generateProductImages(
        faker.helpers.arrayElement(productNames),
        i
      ),
      stock: faker.number.int({ min: 0, max: 100 }),
      isActive: true,
      tags: faker.helpers.arrayElements(
        ["new", "popular", "trending", "bestseller"],
        { min: 1, max: 3 }
      ),
      rating: parseFloat(
        faker.number.float({ min: 1, max: 5, fractionDigits: 1 }).toFixed(1)
      ),
      reviewCount: faker.number.int({ min: 0, max: 100 }),
    });
    products.push(product);
  }

  const savedProducts = await Product.insertMany(products);
  console.log(`📦 Created ${savedProducts.length} products`);
  return savedProducts;
}

async function seedOrders(customers: any[], products: any[]) {
  const orders = [];
  const customerIds = customers
    .filter((user) => user.role === "customer")
    .map((user) => user._id);

  for (let i = 0; i < 30; i++) {
    const orderItems = [];
    const itemCount = faker.number.int({ min: 1, max: 5 });

    for (let j = 0; j < itemCount; j++) {
      const product = faker.helpers.arrayElement(products);
      const quantity = faker.number.int({ min: 1, max: 3 });
      orderItems.push({
        productId: product._id,
        quantity,
        price: product.price,
      });
    }

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      customerId: faker.helpers.arrayElement(customerIds),
      items: orderItems,
      totalAmount,
      status: faker.helpers.arrayElement([
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ]),
      shippingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
      paymentStatus: faker.helpers.arrayElement(["pending", "paid", "failed"]),
    });
    orders.push(order);
  }

  const savedOrders = await Order.insertMany(orders);
  console.log(`📋 Created ${savedOrders.length} orders`);
  return savedOrders;
}

async function main() {
  console.log("🌱 Starting database seeding...");

  await connectDB();
  await clearDatabase();

  const users = await seedUsers();
  const products = await seedProducts(users);
  const orders = await seedOrders(users, products);

  console.log("\n✅ Database seeding completed!");
  console.log(`📊 Summary:`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Orders: ${orders.length}`);

  console.log("\n🔑 Default login credentials:");
  console.log(`   Admin: admin@marketplace.com / admin123`);
  console.log(`   Vendor: [any vendor email] / vendor123`);
  console.log(`   Customer: [any customer email] / customer123`);

  await mongoose.disconnect();
  console.log("\n👋 Disconnected from MongoDB");
}

main().catch(console.error);
