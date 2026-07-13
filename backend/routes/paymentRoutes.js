import express from "express";
import {
  processPayment,
  verifyPayment,
  sendRazorpayKey,
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Razorpay endpoints
router.post("/razorpay/order", isAuthenticated, processPayment);
router.post("/razorpay/verify", isAuthenticated, verifyPayment);
router.get("/razorpay/keyid", isAuthenticated, sendRazorpayKey);

// Legacy endpoints (for backward compatibility)
router.post("/process", isAuthenticated, processPayment);
router.post("/verify", isAuthenticated, verifyPayment);
router.get("/razorpaykey", isAuthenticated, sendRazorpayKey);

export default router;
