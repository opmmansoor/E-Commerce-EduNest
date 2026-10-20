import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react'
import { getOrderCustomers, getOrders } from '../../../Api/adminOrderApi';
import { ChevronDown, ChevronLeft, ChevronRight, Clock, Eye, Icon, PackageCheck, Search, ShoppingBag, Truck, X } from 'lucide-react';

function AdminOrders() {

    const PAGE_SIZE = 5;

    const formatPrice = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

    const formatDate = (date) => {
        if(!date) return "-";

        const parsedDate = new Date(date);
        return Number.isNaN(parsedDate.getTime())
         ? "-"
         : parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
         });
    };


    const statusStyle = {
        Placed: "bg-amber",
        Pending: "bg-amber",
        Processing: "bg-blue-10",
        Shipped: "bg-violet-10",
        Delivered: "bg-green-10",
        Cancelled: "bg-red-10",
    };


    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const {
        data: orders = [], isLoading: ordersLoading, isError:ordersError,
    } = useQuery({
        queryKey:["orders", "admin"],
        queryFn: getOrders,
    });

    const {
        data:users = [], isLoading: usersLoading, isError: userError,
    } = useQuery({
        queryKey: ["adminOrderCustomers"],
        queryFn: getOrderCustomers,
    });

// Match each order with its customer
    const userMap = useMemo(
        () => new Map(users.map((user) => [String(user.id), user])),
        [users]
    );

    const getCustomer = (order) => 
        userMap.get(String(order.userId));

    const getCustomerName = (order) => {
        const user = getCustomer(order);

    if (user) {
        return (
            `${user.firstName || ""} ${user.secondName || ""}`.trim() ||
            user.name ||
            user.email
        );
    }

    return order.shippingAddress?.name || "Unknown customer";
};

// Summary cards
    const placedCount = orders.filter((order) =>
        ["Placed", "Pending", "Processing"].includes(order.status)
    ).length;

    const ShippedCount = orders.filter(
        (order) => order.status === "Shipped"
    ).length;

    const deliveredCount = orders.filter(
        (order) => order.status === "Delivered"
    ).length;


// Search and filter
    const filteredOrders = useMemo(() => {
         return orders.filter((order) => {
            const customer = getCustomer(order);

            const customerName = customer
                ? `${customer.firstName || ""} ${customer.secondName || ""} ${customer.name || ""}`
                : order.shippingAddress?.name || "";

            const matchesSearch = [
                order.id,
                customerName,
                customer?.email,
            ].some((value) =>
            String(value || "")
                .toLowerCase()
                .includes(search.trim().toLowerCase())
            );

            const matchesStatus = status === "all" ||
                                String(order.status || "").toLowerCase() ===
                                status.toLowerCase();

                return matchesSearch && matchesStatus;    
        });
    },[orders, users, search, status]);



    const totalPages = Math.max(
         1,
        Math.ceil(filteredOrders.length / PAGE_SIZE)
    );

    const currentPage = Math.min(page, totalPages);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    if (ordersLoading || usersLoading) {
        return (
            <div className="p-8 text-center text-gray-500">
                Loading orders...
            </div>
        );
    }

    if (ordersError || userError ) {
        return (
            <div className="p-8 text-center text-red-600">
                Failed to load orders or customer details.
                Check that JSON Server is running on port 3000.
            </div>
        )
    }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className='mb-6'>
        <h1 className="text-2xl font-bold text-[#211B4D] sm:text-3xl">
            Order Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
            Track customer orders and view order details. 
        </p>
      </div>

{/* card */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
                {
                    title: "Total Orders",
                    value: orders.length,
                    icon: ShoppingBag,
                    color: "text-[#3D348B]",  
                },
                {
                    title: "Pending / Processing",
                    value: placedCount ,
                    icon: Clock,
                    color: "text-amber-600",
                },
                {
                    title: "Shipped",
                    value: ShippedCount,
                    icon: Truck,
                    color: "text-blue-600",
                },
                {
                    title: "Delivered",
                    value: deliveredCount,
                    icon: PackageCheck,
                    color: "text-green-600",
                },

            ].map((card) => {
                const Icon = card.icon;
                
                return (
                    <div
                        key={card.title}
                        className="rounded-xl border bg-white p-5 shadow-sm">
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    {card.title}
                                </p>
                                <h2 className="mt-2 text-3xl font-bold text-gray-800">
                                    {card.value}
                                </h2>
                            </div>

                            <Icon size={30} 
                                className={card.color}/>
                        </div>
                    </div>
                    );
                 })}
        </div>

  {/* Orders table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                    All Orders
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex items-center gap-2 rounded-lg border px-3">
                        <Search size={18} 
                                className="text-gray-400"/>
                        
                        <input value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1)
                        }} 
                        className="w-full py-2 text-sm outline-none sm:w-56"/>
                    </div>

                    <select value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1)
                        }}
                        className="rounded-lg border px-3 py-2 text-sm"
                        >
                        <option value="all">All Statuses</option>
                        <option value="placed">Placed</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-5 py-4">order ID</th>
                            <th className="px-5 py-4">Customer</th>
                            <th className="px-5 py-4">Date</th>
                            <th className="px-5 py-4">Total</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                       {paginatedOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                           <td className="px-5 py-4 font-semibold text-[#3D348B]">
                            #{order.id}
                           </td>

                           <td className='px-5 py-4'>
                            <p className="font-medium text-gray-800">
                                {getCustomerName(order)}
                            </p>
                            <p className="text-xs text-gray-500">
                                {getCustomer(order)?.email || "-"}
                            </p>
                           </td>

                           <td className="px-5 py-4 text-gray-600">
                            {formatDate(order.timestamp || order.createdAt)}
                           </td>

                           <td className="px-5 py-4 font-semibold">
                            {formatPrice(order.totalAmount)}
                           </td>

                           <td>
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    statusStyle[order.status] ||
                                    "bg-gray-100 text-gray-700"
                                  }`}>
                                    {order.status || "Unknown"}
                            </span>
                           </td>

                           <td className="px-5 py-4">
                            <button 
                                    onClick={() => setSelectedOrder(order)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#3D348B] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#211B4D]">
                                <Eye size={15} />
                                View Details
                            </button>
                           </td>
                        </tr>
                       ))} 


                       {paginatedOrders.length === 0 && (
                        <tr>
                            <td colSpan={6}
                                className="px-5 py-12 text-center text-gray-500" >
                                No orders Found
                            </td>
                        </tr>
                       )}
                    </tbody>
                </table>

{/* Pagination */}
                
                <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">
                        {filteredOrders.length === 0 
                          ? "No orders to display"
                          :`Showing ${
                            (currentPage - 1) * PAGE_SIZE + 1
                          }-${Math.min(
                            currentPage * PAGE_SIZE,
                            filteredOrders.length
                          )} of ${filteredOrders.length} orders`}
                    </p>

                    <div className="flex items-center gap-3">
                        <button 
                                disabled={currentPage === 1}
                                onClick={() => setPage((previous) => previous -1)}
                                className="rounded-lg border p-2 disabled:opacity-40"
                                aria-label="Previous page">
                            <ChevronLeft size={18} />
                        </button>

                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                                disabled={currentPage === totalPages}
                                onClick={() => setPage((previous) => previous + 1)}
                                className="rounded-lg border p-2 disabled:opacity-40"
                                aria-label="Next page">

                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

{/* Order details modal */}
            {selectedOrder && (
                <OrderDetails 
                    order={selectedOrder}
                    customer={getCustomer(selectedOrder)}
                    onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    </div>
  )
}

function OrderDetails({ order, customer, onClose}){
    const address = order.shippingAddress;
    const addressText = 
    typeof address === "string"
        ? address
        : address
            ?[
                address.address,
                address.city,
                address.state,
                address.pincode,
            ].filter(Boolean)
             .join(", ")
            : " No shipping address provided";

    const customerName =
      customer? `${customer.firstName || ""} ${customer.secondName || ""}`.trim() ||
                customer.name || 
                customer.email
             :typeof address === "object"
               ? address?.name || "Unknown customer"
               : "Unknown customer";
    
    const items = Array.isArray(order.items) ? order.items : [];
    
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
             onClick={onClose}>
            <div
                role='dialog'
                aria-modal='true'
                aria-labelledby="order-details-title"
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5" >
                    <div>
                        <h2 id='order-details-title'
                            className="text-xl font-bold text-[#211B4D]">
                            Order #{order.id}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {/* {formatDate(order.timestamp || order.createdAt)} */}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100"
                        aria-label="Close order details"
                      >
                        <X size={20} />
                    </button>
                </div>

                <div>
                    <div>
                        <div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default AdminOrders;