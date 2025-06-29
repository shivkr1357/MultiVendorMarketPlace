import { RequestHandler, Router } from "express";
import { ProductController } from "../controllers/productController";
import { authenticate, authorize } from "../utils/auth";

const router = Router();
const productController = new ProductController();

// Public routes
router.get("/", productController.getProducts.bind(productController));
router.get("/search", productController.searchProducts.bind(productController));
router.get("/:id", productController.getProduct.bind(productController));

// Protected routes (vendor/admin only)
router.post(
  "/",
  authenticate as RequestHandler,
  authorize("vendor", "admin") as RequestHandler,
  productController.createProduct.bind(productController)
);
router.put(
  "/:id",
  authenticate as RequestHandler,
  authorize("vendor", "admin") as RequestHandler,
  productController.updateProduct.bind(productController)
);
router.delete(
  "/:id",
  authenticate as RequestHandler,
  authorize("vendor", "admin") as RequestHandler,
  productController.deleteProduct.bind(productController)
);

export default router;
