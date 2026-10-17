import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedAdminRoute() {

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        user = null;
    }

// Only admins can access admin pages    
    if (!user?.id || user.role !== "admin") {
    return <Navigate to="/login" replace />;
    }

  return  <Outlet />;
}
