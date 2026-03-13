import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role = "user" }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-bg">
        <div className="animate-spin h-12 w-12 border-4 border-marigold border-t-sindoor rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    // Save current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role && user.role !== "admin") {
    // If specific role requested and user doesn't have it (and isn't admin)
    return <Navigate to="/" replace />;
  }

  return children;
}
