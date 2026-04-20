import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
