import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Blocks access to nested routes unless the user is an authenticated admin
const AdminRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;
