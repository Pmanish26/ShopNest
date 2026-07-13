import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../features/orders/orderSlice";

const statusColor = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading || !order) {
    return <p className="text-center py-20 text-gray-500">Loading order...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">Order #{order._id.slice(-8)}</h1>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[order.orderStatus]}`}
        >
          {order.orderStatus}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="font-bold mb-2">Shipping Address</h2>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.address}, {order.shippingAddress.city}
            <br />
            {order.shippingAddress.state}, {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
            <br />
            Phone: {order.shippingAddress.phoneNo}
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 className="font-bold mb-2">Payment</h2>
          <p className="text-sm text-gray-600">
            Method: {order.paymentMethod}
            <br />
            Status: {order.paymentInfo?.status || "Pending"}
            <br />
            {order.paidAt && `Paid on: ${new Date(order.paidAt).toLocaleString()}`}
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <h2 className="font-bold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.orderItems.map((item) => (
            <div key={item._id} className="flex items-center gap-4">
              <img
                src={item.image || "https://placehold.co/80x80"}
                alt={item.name}
                className="h-16 w-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Items</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t mt-2">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
