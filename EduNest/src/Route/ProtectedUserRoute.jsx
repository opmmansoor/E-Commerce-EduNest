import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedUserRoute() {
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        user = null;
    }

// If an admin is logged in, redirect to the admin dashboard
if (user?.id && user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
}

// If a normal user is not logged in, redirect to login
if (!user?.id) {
    return <Navigate to="/login" replace />;
}

// Allow normal users to access user pages
return <Outlet />;
}