import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {

    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
    }

  return (
    <div>
      
    </div>
  )
}

export default Home
