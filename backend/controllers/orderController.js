import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// @desc    Create a new order (checkout)
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentInfo,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ success: false, message: "No order items" });
  }

  // Verify stock and decrement it
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: `Product not found: ${item.name}` });
    }
    if (product.stock < item.quantity) {
      return res
        .status(400)
        .json({ success: false, message: `Insufficient stock for ${product.name}` });
    }
    product.stock -= item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingAddress,
    paymentInfo,
    paymentMethod: paymentMethod || "Razorpay",
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: paymentMethod === "COD" ? undefined : new Date(),
  });

  // Clear the user's cart after successful order
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

  res.status(201).json({ success: true, message: "Order placed successfully", order });
});

// @desc    Get single order details
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderDetails = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  // Only the owner or an admin can view the order
  if (
    order.user._id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ success: false, message: "Not authorized to view this order" });
  }

  res.status(200).json({ success: true, order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/v1/orders/me
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort("-createdAt");

  res.status(200).json({ success: true, count: orders.length, orders });
});

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort("-createdAt");

  const totalAmount = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  res.status(200).json({
    success: true,
    count: orders.length,
    totalAmount,
    orders,
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/v1/orders/:id
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (order.orderStatus === "Delivered") {
    return res
      .status(400)
      .json({ success: false, message: "Order has already been delivered" });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({ success: true, message: "Order status updated", order });
});

// @desc    Delete an order (Admin)
// @route   DELETE /api/v1/orders/:id
// @access  Private/Admin
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  await order.deleteOne();

  res.status(200).json({ success: true, message: "Order deleted" });
});
