import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeFromCart } from "../features/cart/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500 mb-4">Please login to view your cart.</p>
        <Link to="/login" className="text-brand-600 font-medium">
          Go to Login
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/" className="text-brand-600 font-medium">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product}
              className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <img
                src={item.image || "https://placehold.co/100x100"}
                alt={item.name}
                className="h-20 w-20 object-cover rounded-md"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-brand-600 font-semibold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() =>
                    dispatch(
                      updateCartItem({ productId: item.product, quantity: item.quantity - 1 })
                    )
                  }
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  onClick={() =>
                    dispatch(
                      updateCartItem({ productId: item.product, quantity: item.quantity + 1 })
                    )
                  }
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.product))}
                className="text-red-500 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 mb-4">
            <span>Shipping</span>
            <span>{subtotal > 50 ? "Free" : "$5.00"}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-3 mb-6">
            <span>Total</span>
            <span>${(subtotal + (subtotal > 50 ? 0 : 5)).toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-md font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
