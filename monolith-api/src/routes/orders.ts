import { RequestHandler, Router } from "express";
import { OrderController } from "../controllers/orderController";
import { authenticate, authorize } from "../utils/auth";

const router = Router();
const orderController = new OrderController();

// Protected routes
router.get(
  "/",
  authenticate as RequestHandler,
  orderController.getOrders.bind(orderController)
);
router.get(
  "/:id",
  authenticate as RequestHandler,
  orderController.getOrder.bind(orderController)
);
router.post(
  "/",
  authenticate as RequestHandler,
  authorize("customer") as RequestHandler,
  orderController.createOrder.bind(orderController)
);
router.patch(
  "/:id/status",
  authenticate as RequestHandler,
  authorize("vendor", "admin") as RequestHandler,
  orderController.updateOrderStatus.bind(orderController)
);

export default router;
