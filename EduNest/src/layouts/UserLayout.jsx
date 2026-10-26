import React from 'react'
import Navbar from '../Pages/user/Components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../Pages/user/Components/Footer'
import useCheckBlockedUser from '../hooks/useCheckBlockedUser';

function UserLayout() {

  const { pathname } = useLocation();

//Hide Navbar authe pages
  const isAuthpage = pathname === "/register" || pathname === "/login";

//Blocked User logout Automatically  
  useCheckBlockedUser()
  
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
