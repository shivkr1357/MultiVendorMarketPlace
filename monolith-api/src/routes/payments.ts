import { Router } from "express";
import { RequestHandler } from "express";
import { PaymentController } from "../controllers/paymentController";
import { authenticate, authorize } from "../utils/auth";

const router = Router();
const paymentController = new PaymentController();

// Payment routes
router.get(
  "/",
  authenticate as RequestHandler,
  paymentController.getPayments.bind(paymentController)
);
router.get(
  "/:id",
  authenticate as RequestHandler,
  paymentController.getPayment.bind(paymentController)
);
router.post(
  "/process",
  authenticate as RequestHandler,
  paymentController.processPayment.bind(paymentController)
);

// Payout routes (admin/vendor only)
router.get(
  "/payouts",
  authenticate as RequestHandler,
  authorize("admin", "vendor") as RequestHandler,
  paymentController.getPayouts.bind(paymentController)
);
router.post(
  "/payouts",
  authenticate as RequestHandler,
  authorize("admin", "vendor") as RequestHandler,
  paymentController.createPayout.bind(paymentController)
);
router.put(
  "/payouts/:id/status",
  authenticate as RequestHandler,
  authorize("admin") as RequestHandler,
  paymentController.updatePayoutStatus.bind(paymentController)
);

export default router;
