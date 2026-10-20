import { IndianRupee, LogOut, Package, RefreshCcw, ShoppingBag, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../../Api/adminUserApi';
import { getOrders } from '../../../Api/adminOrderApi';
import { getProducts } from '../../../Api/adminProductApi';

export default function AdminDashboard() {
    const navigate = useNavigate();

// Fetch actual products
    const {data: products = [], isLoading, isError, error, refetch, isFetching} = useQuery({
            queryKey: ["products"],
            queryFn: getProducts,
        });
    const {data: users = []} = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });

    const {data: orders = [],} = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    })

// Sum the total amount of all orders
    const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
     0
    );

    const productCount = products.length;
    const usersCount = users.length;
    const ordersCount = orders.length;

    const stats = [
        {
            title: "Total Products",
            value: isLoading ? "..." : isError ? "Error" : productCount,
            icon: Package,
        },
        {
            title: "Total Users",
            value: isLoading ? "..." : isError ? "Error" : usersCount,
            icon: Users,
        },
        {
            title: "Total Orders",
            value: isLoading ? "..." : isError ? "Error" : ordersCount,
            icon: ShoppingBag,
        },
        {
            title: "Total Revenue",
            value: isLoading ? "..." : isError ? "Error" : totalRevenue,
            icon: IndianRupee,
        },
    ];

    // let admin = null;

    // try {
    //     admin = JSON.parse(localStorage.getItem("admin") || "null");
    // } catch {
    //     admin = null;
    // }

    const handleLogout = () => {
        localStorage.removeItem("admin");
        navigate("/admin/login", { replace: true})
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* <header className="flex items-center justify-between bg-[#211B4D] px-4 py-4 text-white sm:px-6">
                <div>
                    <h1 className="text-xl font-bold">
                        EduNest Admin
                    </h1>

                    <p className="text-sm text-gray-300">
                        Admin Dashboard
                    </p>
                </div>

                <button 
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-[#211B4D] transition hover:bg-gray-200">
                    <LogOut size={18} />
                </button>
            </header> */}

{/* Dashboard Content */}
        <main className="p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-[#211B4D]">
                Dashboard Overview
                {/* Welcome, {admin?.firstName || "Admin"} */}
            </h2>

            <p className="mt-2 text-gray-500">
                Here's what's happening in your store.
            </p>

{/* Statistics */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({title, value, icon: Icon}) => (
                    <div
                        key={title}
                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">
                            {title}
                        </p>

                        <div className="rounded-xl bg-[#F7B801]/20 p-3 text-[#3D348B]">
                            <Icon size={22} />
                        </div>
                    </div>

                    <h3 className="mt-5 text-3xl font-bold text-[#211B4D]">
                        {value}
                    </h3>

                    {title === "Total Products" && !isLoading && !isError && (
                        <p className="mt-2 text-sm text-gray-500">
                            Products in your database
                        </p>
                    )}
                </div>
                ))}
            </div>

{/* Product API Loading */}   
            {isLoading && (
                <p className="mt-6 text-gray-500">
                    Loading product statistics...
                </p>
            )}

{/* Product API Error */}
            {isError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-600">
                        {error?.message || "Failed to load products."}
                    </p>

                    <button
                            type='button'
                            onClick={() => refetch()}
                            className="mt-3 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                        <RefreshCcw size={16} />
                        Retry
                    </button>
                </div>
            )}

            {!isLoading && !isError && (
                <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-[#211B4D]">
                                Product Overview
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Your store currently has {productCount}{" "}
                                {productCount === 1 ? "product" : "products"}.
                            </p>
                        </div>

                        <button
                                type="button"
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="flex items-center gap-2 rounded-lg bg-[#3D348B] px-4 py-2 text-white transition hover:bg-[#211B4D] disabled:opacity-60">
                            <RefreshCcw size={16} 
                                        className={isFetching ? "animate-spin" : ""}/>
                            {isFetching ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>
                </section>
            )}            
        </main>

        </div>
    )
}    

//     return (
//     <div className="min-h-screen bg-gray-100">
//       <h2 className="text-2xl font-bold text-[#211B4D]">
//         Dashboard Overview
//       </h2>

//       <p className="mt-2 text-gray-500">
//         Here's what's happening in your store.
//       </p>

//       <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
//         {stats.map(({ title, value, icon: Icon }) => (
//           <div
//             key={title}
//             className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//           >
//             <div className="flex items-center justify-between">
//               <p className="text-sm text-gray-500">{title}</p>

//               <div className="rounded-xl bg-[#F7B801]/20 p-3 text-[#3D348B]">
//                 <Icon size={22} />
//               </div>
//             </div>

//             <h3 className="mt-5 text-3xl font-bold text-[#211B4D]">
//               {value}
//             </h3>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// //   return (
//      <div className="min-h-screen bg-gray-100">
//        <header className="flex items-center justify-between bg-[#211B4D] px-6 py-4 text-white">
//          <h1 className="text-xl font-bold">
//              EduNest Admin
//          </h1>

//          <button 
//                  onClick={handleLogout}
//                  className="rounded-lg bg-white px-4 py-2 font-medium text-[#211B4D] hover:bg-gray-200">
//              Logout
//          </button>
//        </header>

// //       <main className="p-6 md:p-10">
// //         <h2 className="text-2xl font-bold text-gray-800">
// //             Welcome {admin?.name || "admin"}
// //         </h2>

// //         <p className="mt-2 text-gray-600">
// //            You are logged in to the EduNest Admin Panel. 
// //         </p>

// //         <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
// //             {["Products", "Users", "Orders"].map((item) => (
// //                 <div
// //                     key={item}
// //                     className='rounded-xl bg-white p-6 shadow-sm'>
                    
// //                     <h3 className='text-lg font-semibold text-[#3D348B]'>
// //                         {item}
// //                     </h3>

// //                     <p>
// //                         {item} management will be implemented next

// //                     </p>
// //                 </div>
// //             )) }
// //         </div>
// //       </main>
// //     </div>


// //   )
// //