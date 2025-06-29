import { Request, Response } from "express";
import { User } from "../models/User";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../utils/auth";

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      if (!email || !password || !firstName || !lastName || !role) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const existing = await User.findOne({ email });
      if (existing) {
        res.status(409).json({ message: "Email already registered" });
        return;
      }

      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role,
        permissions: role === "admin" ? ["admin:all"] : [],
      });

      const token = generateToken({
        userId: user._id?.toString() || "",
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        user: { ...user.toObject(), password: undefined },
        token,
      });
    } catch (err) {
      res.status(500).json({
        message: "Registration failed",
        error: (err as Error).message,
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Missing email or password" });
        return;
      }

      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const token = generateToken({
        userId: user._id?.toString() || "",
        email: user.email,
        role: user.role,
      });

      res.json({
        user: { ...user.toObject(), password: undefined },
        token,
      });
    } catch (err) {
      res.status(500).json({
        message: "Login failed",
        error: (err as Error).message,
      });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      res.json({ user: { ...user.toObject(), password: undefined } });
    } catch (err) {
      res.status(500).json({
        message: "Failed to get profile",
        error: (err as Error).message,
      });
    }
  }
}
