import express from "express";
import {
  getProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
} from "../controllers/productController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", isAuthenticated, authorizeRoles("admin"), createProduct);

router.get("/:id", getProductDetails);
router.put("/:id", isAuthenticated, authorizeRoles("admin"), updateProduct);
router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteProduct);

router.put("/:id/review", isAuthenticated, createProductReview);
router.get("/:id/reviews", getProductReviews);

export default router;
