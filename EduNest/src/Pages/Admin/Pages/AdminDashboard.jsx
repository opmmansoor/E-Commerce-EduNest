import { IndianRupee, Package, RefreshCcw, ShoppingBag, Users } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../../Api/adminUserApi';
import { getOrders } from '../../../Api/adminOrderApi';
import { getProducts } from '../../../Api/adminProductApi';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,  } from 'recharts';


const STATUS_COLORS = {
  placed: "#F7B801",
  pending: "#F59E0B",
  processing: "#3D348B",
  shipped: "#818CF8",
  delivered: "#16A34A",
  cancelled: "#EF4444",
};

export default function AdminDashboard() {

// Week / Day chart filter
    const [chartFilter, setChartFilter] = useState("week");

// Fetch actual products
    const {data: products = [], isLoading: productsLoading,
         isError: productsError, error: productError,
         refetch: refetchProducts, isFetching: productsFetching,} = useQuery({
            queryKey: ["products"],
            queryFn: getProducts,
        });

    const {data: users = []} = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });

    const {data: orders = [], isLoading: ordersLoading,
        isError: ordersError, refetch: refetchOrders,} = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    })

// Sum dashboard statistics
    const productCount = products.filter((item) => item.isTrashed !== true).length;
    const usersCount = users.filter((user) => user.isBlocked === false).length;
    const ordersCount = orders.length;
    const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
     0
    );


    const stats = [
        {
            title: "Total Products",
            value: productsLoading ? "..." : productsError ? "Error" : productCount,
            icon: Package,
        },
        {
            title: "Total Users",
            value: usersCount,
            icon: Users,
        },
        {
            title: "Total Orders",
            value: ordersLoading ? "..." : ordersError ? "Error" : ordersCount,
            icon: ShoppingBag,
        },
        {
            title: "Total Revenue",
            value: ordersLoading ? "..." : ordersError ? "Error" 
                     : `₹${totalRevenue.toLocaleString("en-IN")}`,
            icon: IndianRupee,
        },
    ];

    // WEEK: Last 7 days, grouped by day
    const chartData = useMemo(() => {
        const now = new Date();

        if ( chartFilter === "week") {
            const days = Array.from({ length: 7}, (_, index) => {
                const date = new Date(now);
                
                date.setDate(now.getDate() - (6 - index));

                return {
                    key: date.toDateString(),
                    label: date.toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                }), 
                orders: 0,
                };
            });

            const dayMap = new Map(days.map((day) => [day.key, day]));

// Count orders for each day
            orders.forEach((order) => {
                const rawDate = order.timestamp || order.createdAt;
                if (!rawDate) return;

                const date = new Date(rawDate);
                if (Number.isNaN(date.getTime())) return;

                const day = dayMap.get(date.toDateString());

                if (day) {
                day.orders += 1;
                }
            });

            return days;
        }

// DAY: Today, grouped by hour        
        const hours = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            label: `${String(hour).padStart(2, "0")}:00`,
            orders: 0,
        }));

        orders.forEach((order) => {
           const rawDate = order.timestamp || order.createdAt;
            if (!rawDate) return; 

           const date = new Date(rawDate);
            if (Number.isNaN(date.getTime())) return;

            const isToday = date.toDateString() === now.toDateString();

            if (isToday) {
                hours[date.getHours()].orders += 1;
            }
        });

// Show only the hours from 00:00 until the current hour
        return hours.slice(0, now.getHours() + 1);
    }, [orders, chartFilter]);

   
// Prepare data for the order-status chart   
      const statusData = useMemo(() => {
    const counts = {};

    orders.forEach((order) => {
      const status = (order.status || "Unknown").trim();
      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [orders]);


    const handleLogout = () => {
        localStorage.removeItem("admin");
        navigate("/admin/login", { replace: true})
    };

return (
    <div className="min-h-screen bg-gray-100">
{/* Dashboard Content */}
        <main className="space-y-8 p-4 sm:p-8">
            <div>
                <h2 className="text-2xl font-bold text-[#211B4D]">
                    Dashboard Overview
                </h2>

                <p className="mt-2 text-gray-500">
                    Here's what's happening in your store.
                </p>
            </div>

{/* Statistics */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ title, value, icon: Icon }) => (
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

                    {title === "Total Products" && !productsLoading && !productError && (
                        <p className="mt-2 text-sm text-gray-500">
                            Products in your database
                        </p>
                    )}
                </div>
                ))}
            </div>


{/* Charts */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
           {/* Monthly orders bar chart */}
           <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
             <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#211B4D]">
                  Orders Overview
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {chartFilter === "week"
                    ? "Orders over the last 7 days"
                    : "Today's orders by hour"}
                </p>
              </div>   
                
                

              {/* Filter Buttons */}
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setChartFilter("week")}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                    chartFilter === "week"
                      ? "bg-[#3D348B] text-white shadow-sm"
                      : "text-gray-600 hover:text-[#3D348B]"
                  }`}
                >
                  Week
                </button>

                <button
                  type="button"
                  onClick={() => setChartFilter("day")}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                    chartFilter === "day"
                      ? "bg-[#3D348B] text-white shadow-sm"
                      : "text-gray-600 hover:text-[#3D348B]"
                  }`}
                >
                  Day
                </button>
              </div>
             </div>

{/* Chart Loading / Error / Data */}
                {ordersLoading ? (
                    <div className="flex h-[280px] items-center justify-center text-gray-500">
                        Loading chart...
                    </div>
                ) : ordersError ? (
                    <div className="flex h-[280px] flex-col items-center justify-center gap-3">
                        <p className="text-sm text-red-600">
                            Failed to load orders
                        </p>
                        <button onClick={() => refetchOrders()}
                                type='button'
                                className="rounded-lg bg-[#3D348B] px-4 py-2 text-white hover:bg-[#211B4D]">
                            Retry
                        </button>
                    </div>
                ) :orders.length === 0 ? (
                    <div className="flex h-[280px] items-center justify-center text-red-500">
                        No orders available yet.
                    </div>
                ) : (
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={chartData}
                                     margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                            
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#E5E7EB"
                            />
                            <XAxis dataKey="label" 
                                   tick={{ fontSize: 12, fill: "#6B7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={chartFilter === "day" ? 3 : 0} />

                            <YAxis allowDecimals={false} 
                                    tick={{ fontSize: 12, fill: "#6B7280" }}
                                    axisLine={false}
                                    tickLine={false}/>

                            <Tooltip formatter={(value) => [value,"Orders", ]}
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "1px solid #E5E7EB",
                                    }}/>

                            <Bar
                                dataKey="orders"
                                name="Orders"
                                fill="#3D348B"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={36}
                            />
                           </BarChart> 
                        </ResponsiveContainer>
                    </div>
                )}
            </section> 

{/* Order status donut chart */}  
            <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                <h3 className="text-lg font-semibold text-[#211B4D]">
                    Order Status
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Breakdown of orders by status.
                </p>

                {ordersLoading ? (
                    <div className="flex h-[280px] items-center justify-center text-gray-500">
                        Loading chart...
                    </div>
                ) : ordersError ? (
                    <div className="flex h-[280px] items-center justify-center text-sm text-red-600">
                        Failed to load order statuses.
                    </div>
                ) : statusData.length === 0 ? (
                    <div className="flex h-[280px] items-center justify-center text-sm text-gray-500">
                        No order statuses available yet.
                    </div>
                ) : (
                <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {statusData.map((item, index) => {
                        const colorKey = item.name.trim().toLowerCase();

                        return(
                        <Cell 
                            key={`${item.name}-${index}`}
                            fill={STATUS_COLORS[colorKey] || "#9CA3AF"}
                            stroke="#FFFFFF"
                            strokeWidth={2}/>
                        )
                      })}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            </section>    


        </div>
{/* Product API Loading */}   
            { productsLoading ? (
                <p className="text-gray-500">
                    Loading product statistics...
                </p>
            ) : productsError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-600">
                        {productError?.message || "Failed to load products."}
                    </p>

                    <button
                        type="button"
                        onClick={() => refetchProducts()}
                        disabled={productsFetching}
                        className="mt-3 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                        <RefreshCcw size={16} />
                        Retry
                    </button>
                </div>
            ) : (
                <section className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-[#211B4D]">
                                Product Overview
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Your Store currently has {productCount}{" "}
                                {productCount === 1 ? "product" : "products"}.
                            </p>
                        </div>

                        <button type="button"
                                onClick={() => refetchProducts()}
                                disabled={productsFetching}
                                className="flex items-center gap-2 rounded-lg bg-[#3D348B] px-4 py-2 text-white transition hover:bg-[#211B4D] disabled:opacity-60"
                                >
                            <RefreshCcw size={16} 
                                        className={productsFetching ? "animate-spin" : ""}/>
                            
                            {productsFetching ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>
                </section>
            )}

        </main>

    </div>
    )
}    