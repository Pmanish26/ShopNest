import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../api/axios";
import { createOrder } from "../features/orders/orderSlice";
import { clearCart } from "../features/cart/cartSlice";

// Dynamically injects the Razorpay Checkout script (only once)
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-checkout-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [razorpayKeyId, setRazorpayKeyId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phoneNo: "",
  });

  useEffect(() => {
    if (items.length === 0) navigate("/cart");
  }, [items, navigate]);

  useEffect(() => {
    const getRazorpayKey = async () => {
      const { data } = await api.get("/payment/razorpay/keyid");
      setRazorpayKeyId(data.razorpayKeyId);
    };
    getRazorpayKey();
  }, []);

  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 50 ? 0 : 5;
  const totalPrice = itemsPrice + shippingPrice;

  const orderItems = items.map((item) => ({
    product: item.product,
    name: item.name,
    quantity: item.quantity,
    image: item.image,
    price: item.price,
  }));

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setAddressConfirmed(true);
  };

  const placeOrder = async (paymentInfo) => {
    const orderAction = await dispatch(
      createOrder({
        orderItems,
        shippingAddress: address,
        paymentInfo,
        paymentMethod: "Razorpay",
        itemsPrice,
        taxPrice: 0,
        shippingPrice,
        totalPrice,
      })
    );

    if (createOrder.fulfilled.match(orderAction)) {
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate(`/orders/${orderAction.payload._id}`);
    } else {
      toast.error(orderAction.payload || "Failed to save order after payment");
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay checkout. Check your connection.");
        setProcessing(false);
        return;
      }

      const { data } = await api.post("/payment/razorpay/order", {
        amount: totalPrice,
        currency: "INR",
      });
      const razorpayOrder = data.order;

      const options = {
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "ShopNest",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#2f6fed" },
        handler: async (response) => {
          try {
            const verifyRes = await api.post("/payment/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              await placeOrder({
                id: response.razorpay_payment_id,
                status: "paid",
              });
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment verification failed");
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        toast.error(response.error?.description || "Payment failed");
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to start payment");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {!addressConfirmed ? (
        <form
          onSubmit={handleAddressSubmit}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4"
        >
          <h2 className="font-bold text-lg">Shipping Address</h2>
          <input
            required
            placeholder="Address"
            value={address.address}
            onChange={(e) => setAddress({ ...address, address: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              required
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              required
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              required
              placeholder="Country"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <input
            required
            placeholder="Phone Number"
            value={address.phoneNo}
            onChange={(e) => setAddress({ ...address, phoneNo: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-md font-medium"
          >
            Continue to Payment
          </button>
        </form>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h2 className="font-bold text-lg mb-3">Order Summary</h2>
            {items.map((item) => (
              <div key={item.product} className="flex justify-between text-sm py-1">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold border-t pt-3 mt-3">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-bold text-lg mb-4">Payment</h2>
            <p className="text-xs text-gray-400 mb-4">
              Test mode: use card 4111 1111 1111 1111, any future expiry, any CVC — or any
              test UPI ID (success@razorpay) in the Razorpay test checkout.
            </p>
            <button
              onClick={handlePayment}
              disabled={!razorpayKeyId || processing}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-md font-medium disabled:opacity-50"
            >
              {processing ? "Processing..." : `Pay $${totalPrice.toFixed(2)} with Razorpay`}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
