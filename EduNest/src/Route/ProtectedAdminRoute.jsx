import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdminRoute() {
    let user = null;
    let admin = null;

    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
        admin = JSON.parse(localStorage.getItem("admin") || "null");
    } catch {
        user = null;
        admin = null;
    }

    const loggedInAdmin =
        (admin?.id && admin.role === "admin") ||
        (user?.id && user.role === "admin");

    if (!loggedInAdmin) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}