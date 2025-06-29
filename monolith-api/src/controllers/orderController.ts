import { Request, Response } from "express";
import mongoose from "mongoose";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { AuthRequest } from "../utils/auth";

export class OrderController {
  async getOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      let query: any = {};

      // Filter orders based on user role
      if (user.role === "customer") {
        query.customerId = user._id;
      } else if (user.role === "vendor") {
        // For vendors, get orders that contain their products
        const userProducts = await Product.find({ vendorId: user._id }).select(
          "_id"
        );
        const productIds = userProducts.map((p) => p._id);
        query["items.productId"] = { $in: productIds };
      }
      // Admin can see all orders

      const orders = await Order.find(query)
        .populate("customerId", "firstName lastName email")
        .populate("items.productId", "name price images")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Order.countDocuments(query);

      res.json({
        data: orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }

      const order = await Order.findById(id)
        .populate("customerId", "firstName lastName email")
        .populate("items.productId", "name price images vendorId");

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Check authorization
      if (
        user.role === "customer" &&
        order.customerId.toString() !== user._id.toString()
      ) {
        return res
          .status(403)
          .json({ error: "Not authorized to view this order" });
      }

      if (user.role === "vendor") {
        const orderProductIds = order.items.map((item) =>
          item.productId.toString()
        );
        const userProductIds = await Product.find({
          vendorId: user._id,
        }).select("_id");
        const hasUserProduct = orderProductIds.some((id) =>
          userProductIds.some((p) => p._id.toString() === id)
        );

        if (!hasUserProduct) {
          return res
            .status(403)
            .json({ error: "Not authorized to view this order" });
        }
      }

      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { items, shippingAddress } = req.body;
      const user = req.user;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Order items are required" });
      }

      if (!shippingAddress) {
        return res.status(400).json({ error: "Shipping address is required" });
      }

      // Validate products and calculate total
      let totalAmount = 0;
      const validatedItems = [];

      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res
            .status(400)
            .json({ error: `Product ${item.productId} not found` });
        }

        if (!product.isActive) {
          return res
            .status(400)
            .json({ error: `Product ${product.name} is not available` });
        }

        if (product.stock < item.quantity) {
          return res
            .status(400)
            .json({ error: `Insufficient stock for ${product.name}` });
        }

        validatedItems.push({
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
        });

        totalAmount += product.price * item.quantity;
      }

      // Create order
      const order = new Order({
        customerId: user._id,
        items: validatedItems,
        totalAmount,
        shippingAddress,
        status: "pending",
        paymentStatus: "pending",
      });

      await order.save();

      // Update product stock
      for (const item of validatedItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      const populatedOrder = await Order.findById(order._id)
        .populate("customerId", "firstName lastName email")
        .populate("items.productId", "name price images");

      res.status(201).json(populatedOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = req.user;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }

      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Check authorization
      if (
        user.role === "customer" &&
        order.customerId.toString() !== user._id.toString()
      ) {
        return res
          .status(403)
          .json({ error: "Not authorized to update this order" });
      }

      if (user.role === "vendor") {
        const orderProductIds = order.items.map((item) =>
          item.productId.toString()
        );
        const userProductIds = await Product.find({
          vendorId: user._id,
        }).select("_id");
        const hasUserProduct = orderProductIds.some((id) =>
          userProductIds.some((p) => p._id.toString() === id)
        );

        if (!hasUserProduct) {
          return res
            .status(403)
            .json({ error: "Not authorized to update this order" });
        }
      }

      order.status = status;
      await order.save();

      const updatedOrder = await Order.findById(id)
        .populate("customerId", "firstName lastName email")
        .populate("items.productId", "name price images");

      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
