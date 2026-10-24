// import { useMutation } from '@tanstack/react-query';
// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { loginAdmin } from '../../../Api/adminApi';
// import Swal from 'sweetalert2';

// export default function AdminLogin() {

//     const navigate  = useNavigate();

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const loginMutation = useMutation({
//         mutationFn: loginAdmin,

//         onSuccess: (admin) => {
//     // Block blocked accounts before saving login data     
//           if (admin.isBlocked === true) {
//             Swal.fire({
//               icon: "error",
//               title: "Account Blocked",
//               text: "Your account has been blocked. Please contact the administrator.",
//               confirmButtonColor: "#3D348B",
//             })
//             return;
//           }
//           // Save only if the account is active
//             localStorage.setItem("admin", JSON.stringify(admin));

//             //Redirect after Successful login
//             navigate("/admin/dashboard", { replace:true });
//         },
//     })

//     const handleSubmit = (e) => {
//       e.preventDefault();

//       loginMutation.mutate({
//         email: email.trim(),
//         password,
//       });
//     };


//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
//         <div className="mb-6 text-center">
//           <h1 className="text-3xl font-bold text-[#3D348B]">
//             EduNest
//           </h1>

//           <p className="mt-2 text-gray-500">
//             Admin Panel Login
//           </p>
//         </div>


//         <form onSubmit={handleSubmit} className="space-y-5">
          
//           <div>
//             <label htmlFor="email"
//                    className="mb-2 block text-sm font-medium text-gray-700" >
//               Email Address
//             </label>

//             <input id='email'
//                    type="email"
//                    autoComplete='username'
//                    value={email}
//                    onChange={(e) => setEmail(e.target.value)}
//                    placeholder='Enter admin Email'
//                    required
//                    className="w-full rounded-lg border border-gray-300 px-4 py-3 
//                               outline-none focus:border-[#3D348B] focus:ring-2 focus:ring-[#3D348B]/20" />
//           </div>

//           <div>
//             <label htmlFor="password"
//                    className="mb-2 block text-sm font-medium text-gray-700">
//               Password
//             </label>

//             <input  id='password'
//                     type="password"
//                     autoComplete='current-password'
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder='Enter Password'
//                     required
//                     className='w-full rouded-lg border border-gray-300 px-4 py-3 
//                                outline-none focus:border-[#3D348B] focus:ring-2 focus:ring-[#3D348B]/20' />
//           </div>

//           {loginMutation.isError && (
//             <p role='alert' className='text-sm text-red-600'>
//               {loginMutation.error.message ||
//                 "Login failed. please try again"}
//             </p>
//           )}

//           <button
//                   type='submit'
//                   disabled={loginMutation.isPending}
//                   className='w-full rounded-lg bg-[#3D348B] px-4 py-3 font-semibold text-white 
//                               transition hover:bg-[#211B4D] disabled:cursor-not-allowed disabled:opacity-60'>
//             {loginMutation.isPending 
//               ? "Logging in..."
//               : "Login as Admin"}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }
