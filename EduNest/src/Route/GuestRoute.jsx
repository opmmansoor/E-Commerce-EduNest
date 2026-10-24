import { Navigate, Outlet } from "react-router-dom";

function GuestRoute() {
    let user = null;
    let admin = null;

    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
        admin = JSON.parse(localStorage.getItem("admin") || "null");
    } catch {
        user = null;
        admin = null;
    }

    // Admin is logged in
    if (admin?.id && admin.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Admin stored under the user key (single-login approach)
    if (user?.id && user.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Normal user is logged in
    if (user?.id) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}

export default GuestRoute;