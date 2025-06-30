import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  vendorId: mongoose.Types.ObjectId;
  images: string[];
  stock: number;
  isActive: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  // Amazon product fields
  url?: string;
  product_id?: string;
  brand?: string;
  features?: string[];
  specifications?: Record<string, any>;
  availability_status?: string;
  prime_eligible?: boolean;
  free_delivery?: boolean;
  seller?: string;
  scraped_at?: Date;
  image_alt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    images: { type: [String], default: [] },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    // Amazon product fields
    url: { type: String },
    product_id: { type: String },
    brand: { type: String },
    features: { type: [String], default: [] },
    specifications: { type: Schema.Types.Mixed, default: {} },
    availability_status: { type: String, default: "In stock" },
    prime_eligible: { type: Boolean, default: false },
    free_delivery: { type: Boolean, default: false },
    seller: { type: String },
    scraped_at: { type: Date },
    image_alt: { type: String },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
