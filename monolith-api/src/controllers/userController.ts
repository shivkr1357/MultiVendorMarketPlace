import { Request, Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../utils/auth";

export class UserController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select("-password");

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({ user });
    } catch (err) {
      res.status(500).json({
        message: "Failed to get user profile",
        error: (err as Error).message,
      });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const updateData = req.body;

      // Remove sensitive fields that shouldn't be updated directly
      delete updateData.password;
      delete updateData.role;
      delete updateData.permissions;

      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({ user });
    } catch (err) {
      res.status(500).json({
        message: "Failed to update user profile",
        error: (err as Error).message,
      });
    }
  }

  async deleteProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({ message: "User profile deleted successfully" });
    } catch (err) {
      res.status(500).json({
        message: "Failed to delete user profile",
        error: (err as Error).message,
      });
    }
  }

  async listUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await User.find({}).select("-password");
      res.json({ users });
    } catch (err) {
      res.status(500).json({
        message: "Failed to list users",
        error: (err as Error).message,
      });
    }
  }
}
