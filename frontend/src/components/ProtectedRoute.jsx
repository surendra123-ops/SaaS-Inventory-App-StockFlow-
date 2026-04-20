import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) {
    return <div className="min-h-screen grid place-items-center text-gray-600">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
