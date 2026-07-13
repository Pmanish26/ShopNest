import express from "express";
import {
  createOrder,
  getOrderDetails,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/", createOrder);
router.get("/me", getMyOrders);
router.get("/", authorizeRoles("admin"), getAllOrders);
router.get("/:id", getOrderDetails);
router.put("/:id", authorizeRoles("admin"), updateOrderStatus);
router.delete("/:id", authorizeRoles("admin"), deleteOrder);

export default router;
