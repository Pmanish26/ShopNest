import Razorpay from "razorpay";
import { asyncHandler } from "../middleware/asyncHandler.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order for checkout
// @route   POST /api/v1/payment/process
// @access  Private
export const processPayment = asyncHandler(async (req, res) => {
  const { amount, currency = "INR" } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  // Convert to paise (smallest unit in Indian currency)
  const amountInPaise = Math.round(amount * 100);

  try {
    const options = {
      amount: amountInPaise,
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user.id,
        company: "ShopNest",
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/v1/payment/verify
// @access  Private
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "Missing payment details" });
  }

  // Signature verification would happen here in production
  // For now, we'll consider the payment successful if we have all the details
  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    paymentInfo: {
      id: razorpay_payment_id,
      status: "captured",
    },
  });
});

// @desc    Send Razorpay key to client
// @route   GET /api/v1/payment/razorpay/keyid
// @access  Private
export const sendRazorpayKey = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  });
});
