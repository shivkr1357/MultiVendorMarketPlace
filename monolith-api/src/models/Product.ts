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
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
