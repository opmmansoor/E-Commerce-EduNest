
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { getOrders } from "../../../Api/orderApi";

function Orders() {
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId = storedUser?.id;

  const {
    data: allOrders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // Show only the logged-in user's orders
  const orders = allOrders
    .filter((order) =>
      userId != null
        ? String(order.userId) === String(userId)
        : false
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-yellow-100 text-yellow-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={16} />;

      case "shipped":
        return <Truck size={16} />;

      case "cancelled":
        return <XCircle size={16} />;

      default:
        return <Clock size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8FF] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3D348B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#FAF8FF] flex flex-col items-center justify-center px-4">
        <Package size={48} className="text-red-500 mb-4" />

        <h2 className="text-xl font-bold text-gray-800">
          Unable to load orders
        </h2>

        <p className="text-gray-500 mt-2 text-center">
          Please check whether JSON Server is running.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-5 bg-[#3D348B] text-white px-6 py-3 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] pt-28 pb-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold text-[#7678ED] mb-2">
              EDUNEST / MY ACCOUNT
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D348B]">
              My Orders
            </h1>

            <p className="text-gray-500 mt-2">
              Track your purchases and view your order details.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-[#3D348B] text-white px-5 py-3 rounded-xl hover:bg-[#2e276b] transition"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>

        {/* Order Count */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 mb-6 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Package className="text-[#3D348B]" size={26} />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <h2 className="text-2xl font-bold text-gray-800">
              {orders.length}
            </h2>
          </div>
        </div>

        {/* Empty Orders */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 sm:p-16 text-center">
            <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag
                size={36}
                className="text-[#3D348B]"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              No orders yet!
            </h2>

            <p className="text-gray-500 mt-3 max-w-md mx-auto">
              You haven't placed any orders yet. Explore our
              stationery collection and find your study essentials.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-6 bg-[#F7B801] text-[#3D348B] font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition"
            >
              Explore Products
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          /* Order List */
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-purple-50/70 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Order ID
                      </p>

                      <p className="font-bold text-[#3D348B] mt-1 break-all">
                        #{order.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Order Date
                      </p>

                      <p className="font-semibold text-gray-700 mt-1">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Date unavailable"}
                      </p>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Total Amount
                      </p>

                      <p className="font-extrabold text-lg text-[#3D348B] mt-1">
                        ₹
                        {Number(order.totalAmount || 0).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 w-fit px-3 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status || "Placed"}
                  </span>
                </div>

                {/* Ordered Products */}
                <div className="p-5 sm:p-6">
                  <h3 className="font-bold text-gray-800 mb-4">
                    Order Items
                  </h3>

                  <div className="space-y-4">
                    {(order.items || []).map((item, index) => (
                      <div
                        key={item.cartItemId || item.productId || index}
                        className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name || "Product"}
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <Package
                              size={28}
                              className="text-gray-400"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800">
                            {item.name || "Product"}
                          </h4>

                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: {item.quantity || 1}
                          </p>

                          <p className="text-sm text-gray-500">
                            ₹{Number(item.price || 0).toLocaleString("en-IN")} each
                          </p>
                        </div>

                        <p className="font-bold text-[#3D348B] text-right">
                          ₹
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 1)
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* View Order Details */}
                  <div className="mt-5 flex justify-end">
                    <Link
                      to={`/order-success/${order.id}`}
                      className="inline-flex items-center gap-2 text-[#3D348B] font-semibold hover:text-[#7678ED] transition"
                    >
                      View Order
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
