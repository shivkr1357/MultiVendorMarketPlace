import { RequestHandler, Router } from "express";
import { AuthController } from "../controllers/authController";
import { authenticate } from "../utils/auth";

const router = Router();
const authController = new AuthController();

// Public routes
router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));

// Protected routes
router.get(
  "/profile",
  authenticate as RequestHandler,
  authController.getProfile.bind(authController)
);

export default router;
