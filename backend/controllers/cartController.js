import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// @desc    Get logged-in user's cart
// @route   GET /api/v1/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({ success: true, cart });
});

// @desc    Add an item to cart (or increase quantity)
// @route   POST /api/v1/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: "Insufficient stock" });
  }

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "",
      quantity: Number(quantity),
    });
  }

  await cart.save();

  res.status(200).json({ success: true, message: "Item added to cart", cart });
});

// @desc    Update quantity of a cart item
// @route   PUT /api/v1/cart/:productId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }

  const item = cart.items.find(
    (i) => i.product.toString() === req.params.productId
  );

  if (!item) {
    return res.status(404).json({ success: false, message: "Item not in cart" });
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId
    );
  } else {
    item.quantity = Number(quantity);
  }

  await cart.save();

  res.status(200).json({ success: true, message: "Cart updated", cart });
});

// @desc    Remove an item from cart
// @route   DELETE /api/v1/cart/:productId
// @access  Private
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== req.params.productId
  );

  await cart.save();

  res.status(200).json({ success: true, message: "Item removed", cart });
});

// @desc    Clear entire cart
// @route   DELETE /api/v1/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.status(200).json({ success: true, message: "Cart cleared", cart });
});
