import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
      maxlength: [120, "Product name cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      maxlength: [8, "Price cannot exceed 8 characters"],
      default: 0,
    },
    images: [
      {
        url: { type: String, required: true },
      },
    ],
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: [
        "Electronics",
        "Clothing",
        "Books",
        "Home & Kitchen",
        "Beauty",
        "Sports",
        "Toys",
        "Other",
      ],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      maxlength: [5, "Stock cannot exceed 5 characters"],
      default: 1,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
