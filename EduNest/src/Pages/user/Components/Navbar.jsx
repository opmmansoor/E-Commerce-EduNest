import { LogOut, User } from 'lucide-react';
import  { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {

    const cart = useSelector((state) => state.cart.cart);

    const navigate = useNavigate();

    const [isProfileOpen, setIsProfileOpen] = useState(false);

// Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");

// Go to Login page
        navigate("/login")        
    };

  return (
    
      <nav className='bg-[#3D348B] text-white shadow-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='h-20 flex items-center justify-between'>
            
            <Link to='/home'
                  className='flex items-center gap-2 group'>
              
                <img src='/image/log.png' alt="log" 
                     className='w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white object-contain p-1 shadow-md 
                                group-hover:scale-105 transition duration-200'/>
                <img src="/image/EduNest.png" alt="EduNest Name"
                     className='w-32 sm:w-40 h-auto object-contain rounded bg-white object-contain p-1 shadow-md
                                group-hover:scale-105 transition duration-200' />
                {/* <span className='text-white'>Edu</span>
                <span className='text-[#F7B801]'>Nest</span> */}
              
            </Link>
            

          <div className='hidden md:flex items-center gap-8 font-semibold'>
            <Link to="/home"
                  className='relative py-2 transition duration-200 hover:text-[#F7B801]
                             after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
                             after:bg-[#F7B801] after:transition-all hover:after:w-full'
                             >
                Home
            </Link>
            <Link to='/about'
                  className='relative py-2 transition duration-200 hover:text-[#F7B801]
                            after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 
                            after:bg-[#F7B801] after:transition-all hover:after:w-full'>
                About
            </Link>
            <Link to='/products'
                  className='relative py-2 transition duration-200 hover:text-[#F7B801]
                            after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 
                            after:bg-[#F7B801] after:transition-all hover:after:w-full'>
                Product
            </Link>
            
            <Link to='/cart'
                  className='relative flex items-center gap-2 py-2 transition duration-200 
                             hover:text-[#F7B801]'>
                Cart

                <span 
                     className='absolute -top-2 -right-4 bg-[#F7B801] text-[#3D348B]
                                 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center'>
                    {cart.length}
                </span>
            </Link>

          </div>
            <div className='relative'>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className='w-11 h-11 rounded-full bg-[#F7B801] text-[#3D348B]
                        flex items-center justify-center hover:bg-[#F18701] hover:text-white
                         transition duration-200 shadow-md'>
                    
                    <User/>
                </button>
                
                {isProfileOpen && (
                    <div className='absolute right-0 mt-3 w-72 bg-white text-gray-800 rounded-xl shadow-2xl
                                    border border-gray-100 overflow-hidden z-50'>

                      <div className='bg-[#7678ED] text-white px-5 py-5'>
                        <div className='flex items-center gap-3'>

                            <div className='w-12 h-12 rounded-full bg-[#F7B801] text-[#3D348B]
                                            flex items-center justify-center font-bold text-lg'>
                                {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
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

                      <div className='px-5 py-4 space-y-4'>
                        <div>
                            <p className='text-xs text-gray-400 uppercase tracking-wide'>
                                Name
                            </p>

                            <p className='font-semibold text-[#3D348B]'>
                                {user?.firstName || "First"}{" "}
                                {user?.secondName || "Name"}
                            </p>
                        </div>

                        <div>
                            <p className='text-xs text-gray-400 uppercase tracking-wide'>
                                Email
                            </p>

                            <p className='font-semibold text-[#3D348B] break-all'>
                                {user?.email || "example@gmail.com"}
                            </p>
                        </div>
                    {/*Divider*/}
                        <div className='border-t'></div>

                    {/* Logout */}
                        <button onClick={handleLogout}
                                className='w-full flex items-center justify-center gap-2
                                           bg-[#F35B04] text-white font-semibold py-3 rounded-lg
                                           hover:bg-[#F18701] transition duration-200'>

                            <LogOut/> 
                            Logout
                        </button>    
                      </div>
                    </div>
                )}
            </div>
           </div> 
        </div>
      </nav>
  )
}

export default Navbar
