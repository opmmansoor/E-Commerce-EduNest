import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
    const navigate = useNavigate();

    let admin = null;

    try {
        admin = JSON.parse(localStorage.getItem("admin") || "null");
    } catch {
        admin = null;
    }

    const handleLogout = () => {
        localStorage.removeItem("admin");
        navigate("/admin/login", { replace: true})
    };


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between bg-[#211B4D] px-6 py-4 text-white">
        <h1 className="text-xl font-bold">
            EduNest Admin
        </h1>

        <button 
                onClick={handleLogout}
                className="rounded-lg bg-white px-4 py-2 font-medium text-[#211B4D] hover:bg-gray-200">
            Logout
        </button>
      </header>

      <main className="p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-800">
            Welcome {admin?.name || "admin"}
        </h2>

        <p className="mt-2 text-gray-600">
           You are logged in to the EduNest Admin Panel. 
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {["Products", "Users", "Orders"].map((item) => (
                <div
                    key={item}
                    className='rounded-xl bg-white p-6 shadow-sm'>
                    
                    <h3 className='text-lg font-semibold text-[#3D348B]'>
                        {item}
                    </h3>

                    <p>
                        {item} management will be implemented next

                    </p>
                </div>
            )) }
        </div>
      </main>
    </div>
  )
}
