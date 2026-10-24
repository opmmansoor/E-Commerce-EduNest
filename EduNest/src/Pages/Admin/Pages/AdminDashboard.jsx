import { CalendarDays, IndianRupee, Package, RefreshCcw, ShoppingBag, Users } from 'lucide-react';
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


//Recent  5 orders
    const recentOrders = useMemo(() => {
        return [...orders].sort((a,b) => {
            const dateA = new Date(a.timestamp || a.createdAt || 0).getTime();
            const dateB = new Date(b.timestamp || b.createdAt || 0).getTime();

            return dateB - dateA;
        })
        .slice(0, 5);
    },[orders]);  


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

  {/* Recent Orders */}
            <section className="w-full min-w-0 overflow-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#F7B801]/20 p-2 text-[#3D348B]">
                            <ShoppingBag size={20}/>
                        </div>

                        <h3 className="text-lg font-bold text-[#211B4D]">
                            Recent Orders
                        </h3>
                      </div>

                        <p className="mt-2 text-sm text-gray-500">
                            A quick look at your latest customer orders.
                        </p>
                    </div>

                    <span className="w-fit rounded-full bg-[#3D348B]/10 px-3 py-1.5 text-xs font-semibold text-[#3D348B]">
                        Latest {Math.min(recentOrders.length, 5)} Orders
                    </span>
                </div>

{/* Loading */}
                {ordersLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3D348B]/20 border-t-[#3D348B]" />
                    </div>
                ) : ordersError ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-red-600">
                            Failed to load recent orders
                        </p>

                        <button type='button'
                                onClick={() => refetchOrders()}
                                className="mt-3 rounded-lg bg-[#3D348B] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#211B4D]">
                            Try Again
                        </button>
                    </div>
                ) : recentOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
                        <div className="mb-4 rounded-full bg-gray-100 p-5">
                            <ShoppingBag size={32} 
                                        className="text-gray-400"/>
                        </div>

                        <h4 className="text-base font-semibold text-[#211B4D]">
                            No orders yet
                        </h4>

                        <p className="mt-1 text-sm text-gray-500">
                            Customer orders will appear here when available.
                        </p>
                    </div>
                ) : (
                    <>
                 {/* Responsive Table */}
                        <div className="w-full min-w-[850px] text-left">
                            <table className="w-full table-fixed text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="w-[16%] px-3 py-4 font-semibold sm:px-4">
                                            order
                                        </th>

                                        <th className="w-[25%] px-3 py-4 font-semibold sm:px-4">
                                            Customer
                                        </th>

                                        <th className="w-[17%] px-3 py-4 font-semibold sm:px-4">
                                            Date
                                        </th>

                                        <th className="w-[12%] px-3 py-4 font-semibold sm:px-4">
                                            Items
                                        </th>

                                        <th className="w-[15%] px-3 py-4 font-semibold sm:px-4">
                                            Amount
                                        </th>

                                        <th className="w-[15%] px-3 py-4 font-semibold sm:px-4">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentOrders.map((order) => {
                                        const customer = users.find(
                                            (user) => String(user.id) === String(order.userId)
                                        );

                                        const customerName = customer 
                                              ? `${customer.firstName || ""} ${
                                                   customer.secondName || ""
                                              }`.trim()
                                              :"Unknown Customer";

                                        const orderDate =
                                            order.timestamp || order.createdAt;

                                        const formattedDate = orderDate
                                            ? new Date(orderDate).toLocaleDateString(
                                                "en-IN", 
                                                {
                                                   day: "2-digit",
                                                   month: "short",
                                                   year: "numeric", 
                                                }
                                            )
                                            : "Date unavailable";

                                        const itemCount = Array.isArray(order.items)
                                            ? order.items.reduce(
                                                (total, item) =>
                                                    total + Number(item.quantity || 1),
                                                0
                                            )
                                            : 0;

                                            const status = (
                                                order.status || "Pending"
                                            ).trim();

                                            const normalizedStatus = status.toLowerCase();

                                            const statusStyles = {
                                                placed: "bg-blue-50 text-blue-700 ring-blue-600/20",
                                                pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
                                                processing: "bg-purple-50 text-purple-700 ring-purple-600/20",
                                                shipped: "bg-purple-50 text-purple-700 ring-purple-600/20",
                                                delivered: "bg-green-50 text-green-700 ring-green-600/20",
                                                cancelled: "bg-red-50 text-red-700 ring-red-600/20",
                                            };

                                            const badgeStyle =
                                                statusStyles[normalizedStatus] ||
                                                "bg-gray-100 text-gray-700 ring-gray-500/20";

                                            return (
                                                <tr key={order.id}
                                                    className="transition-colors hover:bg-gray-50/80">
                                                    <td className="px-3 py-4 sm:px-4">
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <div className="flex items-center gap-3">
                                                                <Package size={18}
                                                                        className="shrink-0 text-[#3D348B]"/>
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="truncate font-semibold text-[#211B4D]">
                                                                    #{String(order.id).slice(-8)}
                                                                </p>
                                                                <p className="mt-1 text-xs text-gray-400">
                                                                    Order ID
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                {/* Customer */}
                                                    <td className="px-3 py-4 sm:px-4">
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7B801]/25 text-sm font-bold text-[#3D348B]">
                                                                {customerName !== "Unknown Customer"
                                                                    ? customerName
                                                                    .charAt(0).toUpperCase()
                                                                    : "U"}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="truncate text-sm font-medium text-gray-800">
                                                                    {customerName}
                                                                </p>

                                                                <p className="truncate text-xs text-gray-500">
                                                                    {customer?.email || "No email"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-3 py-4 sm:px-4">
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                            <CalendarDays size={15} 
                                                                        className="shrink-0 text-gray-400"/>
                                                            <span className="truncate">
                                                                {formattedDate}
                                                            </span>
                                                        </div>
                                                    </td>


                                                    <td className="px-3 py-4 sm:px-4">
                                                        <span className="inline-flex rounded-lg bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-700">
                                                            {itemCount} {" "}
                                                            {itemCount === 1 ? "item" : "items"}
                                                        </span>
                                                    </td>

                                                    <td className="px-3 py-4 sm:px-4">
                                                        <p className="truncate text-sm font-bold text-[#211B4D]">
                                                          ₹ 
                                                          {Number(order.totalAmount || 0)
                                                            .toLocaleString("en-IN")}
                                                        </p>
                                                    </td>


                                                    <td className="px-3 py-4 sm:px-4">
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${badgeStyle}`}>
                                                            <span className="h-1.5 w-1.5 rounded-full bg-current"/>
                                                            {status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                    })}
                                </tbody>
                            </table>
                        </div>

                    {/* Footer */}
                        <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="text-xs text-gray-500">
                               Showing the 5 most recent orders, when available. 
                            </p>

                            <p className="text-xs font-medium text-[#3D348B]">
                                Total orders in store: {orders.length}
                            </p>
                        </div>
                    </>
                )}
            </section>              


        
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