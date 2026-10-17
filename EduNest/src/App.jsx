import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";

import Home from "./Pages/user/Pages/Home";
import Products from "./Pages/user/Pages/Products";
import About from "./Pages/user/Pages/About";
import Cart from "./Pages/user/Pages/Cart";
import Wishlist from "./Pages/user/Pages/Wishlist";
import OrderSuccess from "./Pages/user/Components/OrderSuccess";
import Orders from "./Pages/user/Pages/Orders";
import Checkout from "./Pages/user/Pages/Checkout";

import UserLayout from "./layouts/UserLayout";
import ScrollToTop from "./layouts/ScrollToTop";
import GuestRoute from "./Route/GuestRoute";

import ProtectedAdminRoute from "./Route/ProtectedAdminRoute";
import AdminDashboard from "./Pages/Admin/Pages/AdminDashboard";
import AdminLayout from "./Pages/Admin/Components/AdminLayout";



function App() {
  return (
    <>

      <ScrollToTop/>

      <Routes>

      
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout /> }>
             <Route path="dashboard" element={<AdminDashboard /> } />
           {/* <Route path="products" element={<AdminProducts />}/>
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={ <AdminOrders />}/> */}
          </Route>
        </Route>

        {/* user Layout */}
        <Route element={<UserLayout/>}>
        <Route element={<GuestRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
        
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist/>} />
          
 {/* Checkout and Orders */}
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Unknown URL */}
          <Route path="*" element={<Navigate to="/register" />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
