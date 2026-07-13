import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [keyword, setKeyword] = useState("");

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(keyword ? `/?keyword=${encodeURIComponent(keyword)}` : "/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
        <Link to="/" className="text-2xl font-bold text-brand-600 shrink-0">
          🛒 ShopNest
        </Link>

        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] flex">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products..."
            className="w-full border border-gray-300 rounded-l-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 rounded-r-md text-sm font-medium"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/cart" className="relative hover:text-brand-600">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/orders" className="hover:text-brand-600">
                My Orders
              </Link>
              {user?.role === "admin" && (
                <Link to="/admin/dashboard" className="hover:text-brand-600">
                  Admin
                </Link>
              )}
              <span className="text-gray-500 hidden sm:inline">Hi, {user?.name?.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-brand-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
