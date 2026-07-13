import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchProductDetails } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import api from "../api/axios";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to your cart");
      return;
    }
    dispatch(addToCart({ productId: id, quantity }));
    toast.success("Added to cart");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Please login to submit a review");
      return;
    }
    setSubmittingReview(true);
    try {
      await api.put(`/products/${id}/review`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Review submitted");
      setReviewComment("");
      dispatch(fetchProductDetails(id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !product) {
    return <p className="text-center py-20 text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={product.images?.[0]?.url || "https://placehold.co/500x500?text=No+Image"}
          alt={product.name}
          className="w-full rounded-lg shadow"
        />

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <div className="flex items-center gap-1 text-yellow-500 mt-2">
            {"★".repeat(Math.round(product.ratings || 0))}
            {"☆".repeat(5 - Math.round(product.ratings || 0))}
            <span className="text-gray-400 text-sm ml-1">
              ({product.numOfReviews || 0} reviews)
            </span>
          </div>

          <p className="text-3xl font-bold text-brand-600 mt-4">
            ${product.price?.toFixed(2)}
          </p>

          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          <p className="mt-4 text-sm">
            Availability:{" "}
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">{product.stock} in stock</span>
            ) : (
              <span className="text-red-500 font-medium">Out of stock</span>
            )}
          </p>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mt-5">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-md font-medium"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-14">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

        <form
          onSubmit={handleReviewSubmit}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 max-w-lg"
        >
          <h3 className="font-medium mb-2">Write a review</h3>
          <select
            value={reviewRating}
            onChange={(e) => setReviewRating(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1.5 mb-2 w-full"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 && "s"}
              </option>
            ))}
          </select>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            required
            placeholder="Share your thoughts about this product..."
            className="border border-gray-300 rounded-md px-2 py-1.5 w-full mb-2"
            rows={3}
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-md text-sm disabled:opacity-50"
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {product.reviews?.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {product.reviews?.map((review) => (
              <div
                key={review._id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.name}</span>
                  <span className="text-yellow-500 text-sm">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="text-gray-600 mt-1 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
