import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Blocks access to nested routes unless the user is authenticated
const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
