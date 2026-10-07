import React from 'react'
import Navbar from '../Pages/user/Components/Navbar'
import { Outlet } from 'react-router-dom'

function UserLayout() {
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default UserLayout
