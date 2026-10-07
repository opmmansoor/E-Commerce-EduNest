import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import Home from "./Pages/user/Pages/Home";
import Products from "./Pages/user/Pages/Products";
import About from "./Pages/user/Pages/About";
import Cart from "./Pages/user/Pages/Cart";
import UserLayout from "./layouts/UserLayout";

function App() {
  return (
    <div>
      <Routes>
        {/* user Layout */}
        <Route element={<UserLayout/>}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/Cart" element={<Cart />} />

          {/* Unknown URL */}
          <Route path="*" element={<Navigate to="/register" />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
