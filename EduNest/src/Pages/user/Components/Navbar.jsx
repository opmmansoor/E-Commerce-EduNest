import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate();

    const [isProfileOpen, setIsProfileOpen] = useState(false);

// Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");

// Go to Login page
        navigate("/login")        
    }

  return (
    <div>
      <nav className='bg-[#7678ED] text-white px-6 py-4 shadow-md'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>
                EduNest
            </h1>
            <div className='relative'>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className='w-11 h-11 rounded-full bg-white text-[#7678ED]
                        flex items-center justify-center hover:bg-gray-100 transition'>
                    <svg xmlns='http://www.w3.org/2000/svg'
                         fill='none'
                         viewBox= '0 0 24 24'
                         strokeWidth='2'
                         stroke='currentColor'
                         className='w-6 h-6'>
                        <path strokeLinecap='rounded'
                              strokeLinejoin='rounded'
                              d='M15.75 6a3.75 3.75 0 1 1-7.5 0
                              3.75 3.75 0 0 1 7.5 0ZM4.5
                              20.118a7.5 7.5 0 0 1 15 0A17.933
                              17.933 0 0 0 12 21.75c-2.676
                              0-5.216-.584-7.5-1.632Z'/>
                    </svg>
                </button>
                
                {isProfileOpen && (
                    <div className='absolute right-0 mt-3 w-72 bg-white text-gray-800 rounded-xl shadow-2xl
                                    border border-gray-100 overflow-hidden z-50'>

                      <div className='bg-[#3d348b] text-white px-5 py-5'>
                        <div className='flex items-center gap-3'>

                            <div className='w-12 h-12 rounded-full bg-white text-[#7678ED]
                                            flex items-center justify-center font-bold text-lg'>
                                {user?.firstName.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div>
                                <h2 className='font-bold text-lg'>
                                    Profile
                                </h2>
                                <p className='text-sm text-white/80'>
                                    My Account
                                </p>
                            </div>

                        </div>
                      </div>

                      <div className='px5 py-4 space-y-4'>
                        <div>
                            <p className='text-xs text-gray-400 uppercase'>
                                Name
                            </p>

                            <p className='font-semibold text-gray-800'>
                                {user?.firstName || "First"}{" "}
                                {user?.secondName || "Name"}
                            </p>
                        </div>

                        <div>
                            <p className='text-xs text-gray-400 uppercase'>
                                Email
                            </p>

                            <p className='text-sm text-gray-600 break-all'>
                                {user?.email || "example@gmail.com"}
                            </p>
                        </div>
                    {/*Divider*/}
                        <div className='border-t'></div>

                    {/* Logout */}
                        <button onClick={handleLogout}
                                className='w-full flex items-center justify-center gap-2
                                           bg-[#F35B04] text-white font-semibold py-3 rounded-lg
                                           hover: bg-[#d94f03] transition duration-200'>
                            <svg xmlns='http://www.w3.org/2000/svg'
                                 fill='none'
                                 viewBox='0 0 24 24'
                                 strokeWidth="2"
                                 stroke='currentcolor'
                                 className='w-5 h-5'>
                                <path strokeLinecap='round'
                                      strokeLinejoin='round'
                                      d="M15.75 9V5.25A2.25 2.25
                                      0 0 0 13.5 3h-6a2.25
                                      2.25 0 0 0-2.25 2.25v13.5
                                      A2.25 2.25 0 0 0 7.5
                                      21h6a2.25 2.25 0 0 0
                                      2.25-2.25V15m3-3H9m0
                                      0 3-3m-3 3 3 3"/>
                            </svg>
                            Logout
                        </button>    
                      </div>
                    </div>
                )}
            </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
