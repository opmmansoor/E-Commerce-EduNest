import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../Api/loginApi';


function Login() {

    const navigate = useNavigate();

// Form state
    const [formData,setFormData] = useState({
        email: "",
        password: "",
    })
//Login Mutation
    const loginMutation = useMutation({
        mutationFn: loginUser,

        onSuccess: (user) => {
// Store user information
            localStorage.setItem("user",JSON.stringify({
                id:user.id,
                firstName:user.firstName,
                secondName: user.secondName,
                email: user.email,
            }));
// Store login status
            localStorage.setItem("isLoggedIn", "true");

            alert("Login Successful!")
            

            navigate("/home");
        },
        onError: (error) => {
            console.log("Login error:", error.message);    
        },
    })  

// Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
// Remove error when user starts typing 
            loginMutation.reset();
    };

// Handle login
    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log("LOGIN DATA:", formData);
        
        loginMutation.mutate(formData) 
    };

  return (
    <div className='min-h-screen bg-[#7678ED] flex items-center justify-center px-4 py-8'>
      
{/* Login Card */} 
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"> 
{/* Heading */} 
      <div className="text-center mb-6"> 
        <h1 className="text-3xl font-bold text-[#7678ED]">
             Welcome Back! 
        </h1> 
        <p className="text-gray-500 mt-2"> 
            Login to your account 
        </p> 
      </div>

      
        <form onSubmit={handleSubmit} 
              className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
                E-Mail
            </label>
          
            <input type="text"
                   name='email'
                   value={formData.email}
                   onChange={handleChange}
                   placeholder='Enter E-Mail Address'
                   required 
                   className='w-full px-4 py-3 border border-gray-300 rounded-lg outline-none
                             focus:border-[#7678ED] focus:ring-2 focus:ring-[#7678ED]/20
                             transition'/>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password
            </label>

            <input type="password"
                   name='password'
                   value={formData.password}
                   onChange={handleChange}
                   placeholder='Enter Password'
                   required 
                   className='w-full px-4 py-3 border border-gray-300 rounded-lg outline-none
                             focus:border-[#7678ED] focus:ring-2 focus:ring-[#7678ED]/20
                             transition'/>
          </div>

{/* Error */}
            {loginMutation.isError && (
                <p className='text-red-500 text-sm text-center'>
                    {loginMutation.error.message}
                </p>
            )}

{/* Login Button */}
            <button type='submit'
                    className="w-full bg-[#F35B04] text-white font-semibold py-3 rounded-lg 
                    hover:bg-[#d94f03] active:scale-[0.98] transition duration-200">
                {loginMutation.isPending ? "Logging in...": "Login"}
            </button>
        </form>

{/* Register */}
        <div className='text-center mt-6'>
            <p className='text-gray-500 text-sm'>
                Don't have an account?{" "}

                <Link to="/register" 
                      className='text-[#7678ED] font-semibold cursor-pointer hover:text-[#F35B04]'>
                    Register
                </Link>
            </p>
        </div>

      </div>
    </div>
  )
}

export default Login
