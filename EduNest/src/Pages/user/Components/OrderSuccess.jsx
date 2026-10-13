import { CheckCircle, Package, ShoppingBag, Truck } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

function OrderSuccess() {
    const { orderId } = useParams
  return (
     <div className="min-h-screen bg-[#FAF8FF] px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-10 text-center shadow-lg">

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <CheckCircle size={60} 
                        className="text-green-600"    />
            </div>
            
            <p className="mb-2 text-sm font-bold tracking-widest text-[#7678ED]">
                EDUNEST
            </p>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3D348B]">
                Order Placed Successfully!
            </h1>

            <p className="mx-auto mt-4 max-w-md text-gray-500">
                Thank you for shopping with EduNest. Your order has
                 been received successfully.
            </p>

            {/* Order ID */}
        <div className="mt-6 rounded-xl bg-purple-50 p-4">
          <p className="text-sm text-gray-500">
            Your Order ID
          </p>

          <p className="mt-1 text-xl font-bold text-[#3D348B]">
            #{orderId}
          </p>
        </div>

        {/* Order Status */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
            <CheckCircle
              size={32}
              className="mx-auto text-green-600"
            />

            <h2 className="mt-3 font-bold text-gray-800">
              Order Confirmed
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your order has been received.
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
            <Truck
              size={32}
              className="mx-auto text-[#3D348B]"
            />

            <h2 className="mt-3 font-bold text-gray-800">
              Preparing Your Order
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your items are awaiting processing.
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

          <Link
            to="/orders"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3D348B] px-5 py-3 font-semibold text-white transition hover:bg-[#2d266b]"
          >
            <Package size={20} />
            My Orders
          </Link>

          <Link
            to="/products"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F7B801] px-5 py-3 font-semibold text-[#3D348B] transition hover:bg-yellow-400"
          >
            <ShoppingBag size={20} />
            Continue Shopping
          </Link>

        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;