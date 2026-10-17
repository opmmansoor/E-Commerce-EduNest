import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedAdminRoute() {

    let admin = null;

    try {
        const storedAdmin = sessionStorage.getItem("admin");
        admin = storedAdmin ? JSON.parse(storedAdmin) : null;
    } catch {
        admin = null;
    }

    const isAdmin  = admin? id && admin?.role === "admin";

    if(!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

  return  <Outlet />;
}
