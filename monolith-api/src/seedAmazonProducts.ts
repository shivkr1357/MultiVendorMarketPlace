import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./models/Product";
import fs from "fs";
import path from "path";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/marketplace";

interface AmazonProduct {
  url: string;
  title: string;
  price: string;
  rating: string;
  reviews_count: string;
  availability: string;
  product_id: string;
  image_url: string;
  image_alt: string;
  brand: string | null;
  category: string;
  description: string;
  features: string[];
  specifications: Record<string, any>;
  availability_status: string;
  prime_eligible: boolean;
  free_delivery: boolean;
  seller: string;
  scraped_at: string;
}

function cleanPrice(price: string): number {
  // Remove currency symbols and convert to number
  const cleaned = price.replace(/[^\d.]/g, "");
  return parseFloat(cleaned) || 0;
}

function cleanRating(rating: string): number {
  const cleaned = rating.replace(/[^\d.]/g, "");
  return parseFloat(cleaned) || 0;
}

function cleanReviewCount(reviewsCount: string): number {
  // Extract number from "1,076 global ratings"
  const match = reviewsCount.match(/(\d+(?:,\d+)*)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, "")) || 0;
  }
  return 0;
}

function extractCategory(category: string): string {
  // Extract main category from "Outdoor Living > Gardening > Plant Containers > Flower Pots"
  const parts = category.split(" > ");
  return parts[0] || "Other";
}

function mapAmazonToProduct(
  amazonProduct: AmazonProduct,
  vendorId: mongoose.Types.ObjectId
) {
  return {
    name: amazonProduct.title || "Untitled Product",
    description:
      amazonProduct.description || "No description available for this product.",
    price: cleanPrice(amazonProduct.price),
    category: extractCategory(amazonProduct.category),
    vendorId,
    images: [amazonProduct.image_url],
    stock: Math.floor(Math.random() * 100) + 10, // Random stock
    isActive: true,
    tags: ["amazon", "imported"],
    rating: cleanRating(amazonProduct.rating),
    reviewCount: cleanReviewCount(amazonProduct.reviews_count),
    url: amazonProduct.url,
    product_id: amazonProduct.product_id,
    brand: amazonProduct.brand,
    features: amazonProduct.features || [],
    specifications: amazonProduct.specifications || {},
    availability_status: amazonProduct.availability_status || "Unknown",
    prime_eligible: amazonProduct.prime_eligible || false,
    free_delivery: amazonProduct.free_delivery || false,
    seller: amazonProduct.seller,
    scraped_at: new Date(amazonProduct.scraped_at),
    image_alt: amazonProduct.image_alt,
  };
}

async function seedAmazonProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared products collection");

    // Read the JSON file
    const jsonPath = path.join(__dirname, "../enriched_amazon_products.json");
    const jsonData = fs.readFileSync(jsonPath, "utf8");
    const amazonProducts: AmazonProduct[] = JSON.parse(jsonData);

    console.log(`📖 Found ${amazonProducts.length} Amazon products to seed`);

    // Create a default vendor ID for all products
    const defaultVendorId = new mongoose.Types.ObjectId();

    // Process products in batches
    const batchSize = 50;
    const products = [];

    for (let i = 0; i < amazonProducts.length; i++) {
      const amazonProduct = amazonProducts[i];

      try {
        const productData = mapAmazonToProduct(amazonProduct, defaultVendorId);
        products.push(productData);

        // Insert batch when it reaches batchSize or at the end
        if (products.length >= batchSize || i === amazonProducts.length - 1) {
          await Product.insertMany(products);
          console.log(
            `📦 Inserted batch of ${products.length} products (${i + 1}/${
              amazonProducts.length
            })`
          );
          products.length = 0; // Clear the batch
        }
      } catch (error) {
        console.error(`❌ Error processing product ${i + 1}:`, error);
        continue;
      }
    }

    const totalProducts = await Product.countDocuments();
    console.log(`🎉 Successfully seeded ${totalProducts} Amazon products`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding Amazon products:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedAmazonProducts();
}
