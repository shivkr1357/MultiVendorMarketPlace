import { Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";
import { AuthRequest } from "../utils/auth";

export class ProductController {
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const category = req.query.category as string;

      const skip = (page - 1) * limit;

      // Build query
      const query: any = { isActive: true };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      if (category) {
        query.category = category;
      }

      // Get products with pagination
      const products = await Product.find(query)
        .populate("vendorId", "firstName lastName email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      // Get total count for pagination
      const total = await Product.countDocuments(query);

      res.json({
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid product ID" });
        return;
      }

      const product = await Product.findById(id).populate(
        "vendorId",
        "firstName lastName email"
      );

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const productData = req.body;
      const user = req.user;

      // Validate required fields
      if (!productData.name || !productData.description || !productData.price) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      // Set vendor ID from authenticated user
      productData.vendorId = user._id;

      const product = new Product(productData);
      await product.save();

      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const user = req.user;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid product ID" });
        return;
      }

      const product = await Product.findById(id);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      // Check if user is the vendor or admin
      if (
        product.vendorId.toString() !== user._id.toString() &&
        user.role !== "admin"
      ) {
        res
          .status(403)
          .json({ error: "Not authorized to update this product" });
        return;
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid product ID" });
        return;
      }

      const product = await Product.findById(id);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      // Check if user is the vendor or admin
      if (
        product.vendorId.toString() !== user._id.toString() &&
        user.role !== "admin"
      ) {
        res
          .status(403)
          .json({ error: "Not authorized to delete this product" });
        return;
      }

      await Product.findByIdAndDelete(id);

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q) {
        res.status(400).json({ error: "Search query required" });
        return;
      }

      const products = await Product.find({
        $and: [
          { isActive: true },
          {
            $or: [
              { name: { $regex: q, $options: "i" } },
              { description: { $regex: q, $options: "i" } },
              { category: { $regex: q, $options: "i" } },
              { tags: { $in: [new RegExp(q as string, "i")] } },
            ],
          },
        ],
      })
        .populate("vendorId", "firstName lastName email")
        .limit(20);

      res.json({ data: products });
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
