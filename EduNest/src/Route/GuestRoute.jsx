import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

function GuestRoute() {

    const user = JSON.parse(localStorage.getItem ("user") || null);
    const isLoggedIn = Boolean(user?.id);

// Logged-in users cannot access Login or Register
    if(isLoggedIn) {
        return <Navigate to="/home" replace />
    }

// Allow guests to access these pages
    return <Outlet />
}

export default GuestRoute
