import React from 'react'
import Navbar from '../Pages/user/Components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../Pages/user/Components/Footer'

function UserLayout() {

  const { pathname } = useLocation();

//Hide Navbar authe pages
  const isAuthpage = pathname === "/register" || pathname === "/login";

  return (
    <div className='min-h-screen bg-gray-50'>

     {!isAuthpage && <Navbar/>}

{/* Page Content */}
      <main> 
        <Outlet/>
      </main>
      
        <Footer />
      
    </div>
  )
}

export default UserLayout
