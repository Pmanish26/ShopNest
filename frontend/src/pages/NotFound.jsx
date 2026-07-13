import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="text-center py-32">
    <h1 className="text-6xl font-bold text-brand-600 mb-4">404</h1>
    <p className="text-gray-500 mb-6">Oops! The page you're looking for doesn't exist.</p>
    <Link to="/" className="text-brand-600 font-medium">
      Go back home
    </Link>
  </div>
);

export default NotFound;
