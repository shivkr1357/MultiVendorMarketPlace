import { RequestHandler, Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticate, authorize } from "../utils/auth";

const router = Router();
const userController = new UserController();

// Protected routes
router.get(
  "/:id",
  authenticate as RequestHandler,
  userController.getProfile.bind(userController)
);
router.put(
  "/:id",
  authenticate as RequestHandler,
  userController.updateProfile.bind(userController)
);
router.delete(
  "/:id",
  authenticate as RequestHandler,
  userController.deleteProfile.bind(userController)
);
router.get(
  "/",
  authenticate as RequestHandler,
  authorize("admin") as RequestHandler,
  userController.listUsers.bind(userController)
);

export default router;
