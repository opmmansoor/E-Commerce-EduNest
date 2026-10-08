import React from 'react'
import Navbar from '../Pages/user/Components/Navbar'
import { Outlet } from 'react-router-dom'

function UserLayout() {
  return (
    <div className='min-h-screen bg-gray-50 pb-20'>

      <Navbar/>

{/* Page Content */}
      <main className='pt-20'> 
        <Outlet/>
      </main>
      
      
    </div>
  )
}

export default UserLayout
