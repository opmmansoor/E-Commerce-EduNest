import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

function GuestRoute() {

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem ("user") || null);
    } catch {
        user = null;
    }
// Redirect already logged-in users according to role
    if(user?.id) {
        if(user.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        return <Navigate to="/home" replace />;
    }

    return <Outlet />
}

export default GuestRoute
