import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Login() {

    const navigate = useNavigate();

// Form state
    const [formData,setFormData] = useState({
        email: "",
        password: "",
    })

// Error message 
    const [error, setError] = useState("");    

// Handle input changes
    const handleChange = (e) => {
        const { name,value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        })
// Remove error when user starts typing 
            setError("");
    };

// Handle login
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
// Get all users from JSON Server 
            const response = await axios.get( "http://localhost:5001/users" )

            const users = response.data

            const user = users.find(
                (user) => 
                    user.email === formData.email &&
                user.password === formData.password
            )

            if (user) {
// Save logged-in user
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id:user.id,
                        firstName: user.firstName,
                        secondName: user.secondName,
                        email: user.email,
                    })
                )                
                alert ("Login successful!")
                console.log("Logged in user:", user);
// Navigate to home 
                navigate("/home")
            }else{

                setError("Invalid email or password")
            }
        } catch (error) {

            console.error("Login Error:", error);

            setError("Unable to connect to server. Please start JSON Server.")
            
        }    
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
            {error && (
                <p className='text-red-500 text-sm text-center'>
                    {error}
                </p>
            )}

{/* Login Button */}
            <button type='submit'
                    className="w-full bg-[#F35B04] text-white font-semibold py-3 rounded-lg 
                    hover:bg-[#d94f03] active:scale-[0.98] transition duration-200">
                Login
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
