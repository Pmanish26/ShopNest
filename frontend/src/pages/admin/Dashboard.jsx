import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/products/productSlice";
import { fetchAllOrders } from "../../features/orders/orderSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products, totalProducts } = useSelector((state) => state.products);
  const { orders, totalAmount } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1 }));
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const outOfStock = products.filter((p) => p.stock === 0).length;

  const cards = [
    { label: "Total Products", value: totalProducts, link: "/admin/products" },
    { label: "Total Orders", value: orders.length, link: "/admin/orders" },
    { label: "Total Revenue", value: `$${(totalAmount || 0).toFixed(2)}`, link: "/admin/orders" },
    { label: "Out of Stock", value: outOfStock, link: "/admin/products" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold text-brand-600 mt-1">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link
          to="/admin/products/new"
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Add New Product
        </Link>
        <Link
          to="/admin/products"
          className="bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
        >
          Manage Products
        </Link>
        <Link
          to="/admin/orders"
          className="bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
        >
          Manage Orders
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
