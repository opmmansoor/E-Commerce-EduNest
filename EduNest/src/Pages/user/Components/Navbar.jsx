import { useQuery } from '@tanstack/react-query';
import { Heart, LogOut, Package, ShoppingCart, User } from 'lucide-react';
import  { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart } from '../../../Api/cartApi';
import { getWishlists } from '../../../Api/wishlistApi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../Slice/authSlice';

function Navbar() {
    
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.id ? String(user.id) : null; 

    const {data: cart=[], isLoading: cartLoading } = useQuery({
        queryKey: ["carts", userId],
        queryFn: () => getCart(userId),
        enabled: Boolean(userId),
    })

    const cartCount = Array.isArray(cart)
        ? cart.reduce((total, item) => total + Number(item.quantity || 0), 0)
        : 0;
    
    const {
        data: wishlist = [],
        isLoading: wishlistLoading,
        isError: wishlistError,
      } = useQuery({
        queryKey: ["wishlists", userId],
        queryFn: () => getWishlists(userId),
        enabled: Boolean(userId),
      });

      const wishlistCount = Array.isArray(wishlist)
        ? wishlist.length
        : 0;
    
    const navigate = useNavigate();

    const [isProfileOpen, setIsProfileOpen] = useState(false);

// Get user data from localStorage
    // const user = JSON.parse(localStorage.getItem("user"));

    const dispatch = useDispatch();

    // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    // const user = useSelector((state) => state.auth.user);
    

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileOpen(false);

// Go to Login page
        navigate("/login")        
    };

  return (
    
      <nav className='fixed top-0 left-0 right-0  z-50 bg-white/50 text-[#3D348B] backdrop-blur-xl shadow-md '>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='h-16 flex items-center justify-between'>
            
            <Link to='/home'
                  className='flex items-center gap-2 '>
              
                <img src='/image/log.png' alt="log" 
                     className='w-12 h-12 rounded-full bg-white object-contain p-1'/>
                <img src="/image/EduNest.png" alt="EduNest Name"
                     className='w-32 sm:w-40 h-auto bg-white p-1' />
                {/* <span className='text-white'>Edu</span>
                <span className='text-[#F7B801]'>Nest</span> */}
              
            </Link>
            

          <div className='hidden md:flex items-center gap-8 font-semibold'>
            <Link to="/home"
                  className='hover:text-[#F7B801]'
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

            <Link to="/wishlist"
                  className='relative flex items-center gap-2 hover:text-[#F7B801]' >
                <Heart size={21}/>
            

                <span className='absolute -top-3 -right-5 bg-[#F7B801] text-[#3D348B] text-xs 
                      font-bold w-5 h-5 rounded-full flex items-center justify-center'>
                    {wishlistLoading ? "..." : wishlistCount}
                </span>
            </Link>
            
            <Link to='/cart'
                  className='relative flex items-center gap-2 hover:text-[#F7B801]'>
                <ShoppingCart size={21}/>
                

                <span 
                     className='absolute -top-3 -right-5 bg-[#F7B801] text-[#3D348B]
                                 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center'>
                    {cartCount}
                </span>
            </Link>

            <Link
                to="/orders"
                className="hover:text-[#F7B801] transition"
                            >
                    <Package />
            </Link>
          </div>
          
            <div className="relative">
              {user ? (
                <>
      {/* Profile Button */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-11 h-11 rounded-full bg-[#F7B801] text-[#3D348B]
                            flex items-center justify-center hover:bg-[#F18701]
                            hover:text-white transition duration-200 shadow-md"
                    >
                    <User />
                   </button>

      {/* Profile Dropdown */}
                {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white text-gray-800
                                rounded-xl shadow-2xl border border-gray-100
                                overflow-hidden z-50">

                        <div className="bg-[#7678ED] text-white px-5 py-5">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#F7B801]
                                    text-[#3D348B] flex items-center
                                    justify-center font-bold text-lg">
                                 {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                                </div>

                                <div>
                                    <h2 className="font-bold text-lg">Profile</h2>
                                    <p className="text-sm text-white/80">My Account</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-5 py-4 space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase">
                                    Name
                                </p>
                                <p className="font-semibold text-[#3D348B]">
                                    {user?.firstName} {user?.secondName}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 uppercase">
                                    Email
                                </p>
                                <p className="font-semibold text-[#3D348B] break-all">
                                    {user?.email}
                                </p>
                            </div>

                            <hr />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2
                                    bg-[#F35B04] text-white font-semibold py-3
                                    rounded-lg hover:bg-[#F18701] transition"
                                >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                  )}
                </>
            ) : (
    /* Login Button after logout */
                <Link
                     to="/login"
                     className="bg-[#F7B801] text-[#3D348B] font-bold
                        px-5 py-2.5 rounded-lg hover:bg-[#F18701]
                        hover:text-white transition duration-200"
                    >
                    Login
                    </Link>
                )}
            </div>

           </div> 
        </div>
      </nav>
  )
}

export default Navbar
