import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
    >
      <img
        src={product.images?.[0]?.url || "https://placehold.co/500x500?text=No+Image"}
        alt={product.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <div className="flex items-center gap-1 text-yellow-500 text-sm">
          {"★".repeat(Math.round(product.ratings || 0))}
          {"☆".repeat(5 - Math.round(product.ratings || 0))}
          <span className="text-gray-400 ml-1">({product.numOfReviews || 0})</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-brand-600">${product.price?.toFixed(2)}</span>
          {product.stock === 0 ? (
            <span className="text-xs text-red-500 font-medium">Out of stock</span>
          ) : (
            <span className="text-xs text-green-600 font-medium">In stock</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
