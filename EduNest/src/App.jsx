import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Register from './Pages/auth/Register'
import Login from './Pages/auth/Login'
import Home from './Pages/user/Home'

function App() {
  return (
    <div>
      <Routes>

        <Route path='/register'  element={<Register/>} />

        <Route path='/login'  element={<Login/>}  />

        <Route path='/home'  element={<Home/>} /> 

{/* First page */}
        <Route path='*'
               element={<Navigate to="/register"/>} />    

{/* Unknown URL */}
        <Route path="*" element={<Navigate to="/register" />} />

      </Routes>
      
    </div>
  )
}

export default App
