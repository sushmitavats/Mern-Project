import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { hasPermission } from "./utils/hasPermission";

export default function ProtectedRoute({ children, module }) {
  const token = localStorage.getItem("token");
  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Invalid or expired token
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");

      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    return <Navigate to="/login" replace />;
  }
  // Permission check (only when module is provided)
  if (module && !hasPermission(module, "view")) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
