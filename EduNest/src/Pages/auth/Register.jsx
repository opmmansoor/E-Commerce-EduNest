import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {

    const navigate = useNavigate();

// Form state
    const [formData,setFormData] = useState({
        firstName: "",
        secondName: "",
        email: "",
        password: "",
        Cpassword: "",
    })

// Handle input changes    
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        })
    };

// Handle form submit
    const handleSubmit = async (e) =>{
        e.preventDefault();

        if(formData.password !== formData.Cpassword){
            alert("Passwords do not match");
            return;
        }

        try{
            //email already exists
            const response =await axios.get("http://localhost:5001/users")

            const existingUser = response.data.find(
                (user) => user.email === formData.email
            )

            if(existingUser) {
                alert("Email already exists")
                return
            }
// Create new user
            const newUser = {
                firstName: formData.firstName,
                secondName: formData.secondName,
                email: formData.email,
                password: formData.password
            }

// POST user to JSON Server
            await axios.post("http://localhost:5001/users", newUser)

            alert("Registration successful!")

            // Go to login page
        navigate("/login");

        }catch (error){
            console.error("Registration Error:", error)

            alert("Registration failed. Check JSON Server.")
        }
    }

  return (

    <div className='min-h-screen bg-[#7678ED] flex items-center justify-center px-4 py-8'>

     {/* Card */}
     <div className='w-full max-w-md bg-white rounded-2xl shadow-2xl p-8'>
      
      <div className='text-center mb-6'>  
        <h1 className="text-3xl font-bold text-[#7678ED]">
            Register Now!
        </h1>
        <p className='text-gray-500 mt-2'>
            Create Your new Account
        </p>
      </div>  


        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                    First Name
                </label>
                <input type="text"
                       name='firstName'
                       value={formData.firstName}
                       placeholder='Enter First Name'
                       onChange={handleChange}
                       required 
                       className='w-full px-4 py-3 border border-gray-300 rounded-lg outline-none
                                  focus:border-[#7678ED] focus:ring-2 focus:ring-[#7678ED]/20 transition'/>

                <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Second Name
                </label>
                <input type="text"
                       name='secondName'
                       value={formData.secondName}
                       placeholder='Enter Second Name'
                       onChange={handleChange}
                       required 
                       className='w-full px-4 py-3 border border-gray-300 rounded-lg outline-none
                                  focus:border-[#7678ED] focus:ring-2 focus:ring-[#7678ED]/20 transition'/>

                <label className='block text-sm font-medium text-gray-700 mb-1'>
                    E-Mail
                </label>
                <input type="email"
                       name='email'
                       value={formData.email}
                       placeholder='Enter E-Mail Address'
                       onChange={handleChange}
                       required
                       className='w-full px-4 py-3 border border-gray-300 rounded-lg outline-none
                                  focus:border-[#7678ED] focus:ring-2 focus:ring-[#7678ED]/20 transition'/>

                <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Password
                </label>
                <input type="password"
                       name='password'
                       value={formData.password}
                       placeholder='Enter Password'
                       onChange={handleChange}
                       required 
                       className='w-full px-4 py-3 border border-gray-300 rounded-lg outline-none
                                  focus:border-[#7678ED] focus:ring-2 focus:ring-[#7678ED]/20 transition'/>

                <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Confirm Password
                </label>
                <input type="password"
                       name='Cpassword'
                       value={formData.Cpassword}
                       placeholder='Enter Confirm Password'
                       onChange={handleChange}
                       required
                       className='w-full px-4 py-3 border border-gray-300 rounded-lg outline-none
                                  focus:border-[#7678ED] focus:ring-2 focus:ring-[#7678ED]/20 transition'/>                            
            </div>


                <button type='submit'
                        className='w-full bg-[#F35B04] text-white font-semibold py-3 rounded-lg mt-2
                                   hover:bg-[#d94f03] active:scale-[0.98] transition duration-200'>
                    Register
                </button>
        </form>

{/* Login */}        
            <div className='text-center mt-6'>
                <p className='text-gray-500 text-sm'>
                    Already have an account?{" "}

                    <Link to="/login" 
                          className='text-[#7678ED] font-semibold cursor-pointer hover:text-[#F35B04]'>
                        Login
                    </Link>
                </p>
            </div>
     </div> 
    </div>
  )
}

export default Register
