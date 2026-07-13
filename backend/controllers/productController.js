import Product from "../models/Product.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// @desc    Get all products (search, filter, pagination)
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const resultsPerPage = Number(process.env.RESULT_PER_PAGE) || 8;
  const currentPage = Number(req.query.page) || 1;

  const queryObj = {};

  if (req.query.keyword) {
    queryObj.$text = { $search: req.query.keyword };
  }

  if (req.query.category) {
    queryObj.category = req.query.category;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
  }

  if (req.query.ratings) {
    queryObj.ratings = { $gte: Number(req.query.ratings) };
  }

  const totalProducts = await Product.countDocuments(queryObj);

  let sort = "-createdAt";
  if (req.query.sort === "price_asc") sort = "price";
  if (req.query.sort === "price_desc") sort = "-price";
  if (req.query.sort === "rating") sort = "-ratings";

  const products = await Product.find(queryObj)
    .sort(sort)
    .limit(resultsPerPage)
    .skip(resultsPerPage * (currentPage - 1));

  res.status(200).json({
    success: true,
    count: products.length,
    totalProducts,
    resultsPerPage,
    currentPage,
    totalPages: Math.ceil(totalProducts / resultsPerPage),
    products,
  });
});

// @desc    Get single product details
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductDetails = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "user",
    "name"
  );

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.status(200).json({ success: true, product });
});

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({ success: true, message: "Product created", product });
});

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: "Product updated", product });
});

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  await product.deleteOne();

  res.status(200).json({ success: true, message: "Product deleted" });
});

// @desc    Create or update a product review
// @route   PUT /api/v1/products/:id/review
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const existingReview = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    existingReview.rating = review.rating;
    existingReview.comment = review.comment;
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Review added" });
});

// @desc    Get all reviews of a product
// @route   GET /api/v1/products/:id/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.status(200).json({ success: true, reviews: product.reviews });
});
