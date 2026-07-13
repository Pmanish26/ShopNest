import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";
import ProductCard from "../components/ProductCard";

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Beauty",
  "Sports",
  "Toys",
  "Other",
];

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, totalPages, currentPage } = useSelector(
    (state) => state.products
  );

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    dispatch(fetchProducts({ keyword, category, page }));
  }, [dispatch, keyword, category, page]);

  const handleCategoryClick = (cat) => {
    const params = { page: 1 };
    if (keyword) params.keyword = keyword;
    if (cat) params.category = cat;
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = { page: newPage };
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleCategoryClick("")}
          className={`px-3 py-1.5 rounded-full text-sm border ${
            !category
              ? "bg-brand-600 text-white border-brand-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              category === cat
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {keyword && (
        <p className="text-gray-600 mb-4">
          Search results for: <span className="font-semibold">"{keyword}"</span>
        </p>
      )}

      {loading ? (
        <p className="text-center py-20 text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center py-20 text-gray-500">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`h-9 w-9 rounded-md text-sm font-medium ${
                    p === currentPage
                      ? "bg-brand-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
