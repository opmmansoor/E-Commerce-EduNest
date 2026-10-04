import React, { useState } from 'react'

function Login() {

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
    const handleSubmit = (e) => {
        e.preventDefault();

        if(
            formData.email === "test@gmail.com" &&
            formData.password === "123456"
        ){
            alert("Login successful!")

            console.log("Login Data:",formData);
        }else{
            setError("Invalid email or password")
        }    
    };

  return (
    <div className='min-h-screen bg-[#7678ED] flex item-center justify-center px-4 py-8'>
      
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

            <input type="text"
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

                <span className='text-[#7678ED] font-semibold cursor-pointer hover:text-[#F35B04]'>
                    Register
                </span>
            </p>
        </div>

      </div>
    </div>
  )
}

export default Login
