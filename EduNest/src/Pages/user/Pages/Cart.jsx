import React from "react";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../../../Slice/cartSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCartItem, getCart, updateCartItem } from "../../../Api/cartApi";
import { toast } from "sonner";
import { ArrowLeft, Minus, Package, Plus, ShoppingBag, ShoppingCart, Trash, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";



function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = storedUser?.id ? String(storedUser.id) : null;

  const {
    data: cart = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["carts", userId],
    queryFn: () => getCart(userId),
    enabled: Boolean(userId),
  });

  const refreshCart = () => {
    queryClient.invalidateQueries({
      queryKey: ["carts", userId],
    });
  };

  // Update quantity in JSON Server
  const quantityMutation = useMutation({
    mutationFn: updateCartItem,

    onSuccess: () => {
      refreshCart();
      toast.success("Cart quantity updated.");
    },
    onError: (error) => {
      toast.error(error.message || "Could not update quantity.");
    },
  });

  //Remove item from JSON
  const removeMutation = useMutation({
    mutationFn: deleteCartItem,

    onSuccess: () => {
      refreshCart();
      toast.success("Item removed from Cart");
    },
    onError: (error) => {
      toast.error(error.message || "Could not remove product.");
    },
  });

  //Plus/Minus Button
  const handleQuantityChange = (item, quantity) => {
    if (!userId) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    if (quantity < 1) {
    toast.error("Quantity cannot be less than 1.");
    return;
  }

    quantityMutation.mutate({
      id: item.id,
      userId,
      quantity,
    });
  };

  //Remove Item
  const handleRemove = (item) => {
    if (!userId) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    removeMutation.mutate({
      id: item.id,
      userId,
    });
  };

// Count the number of different products in the cart
  const totalItems = cart.length;
  // Calculate total quantity
  const totalQuantity = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );
  // total price
  const totalAmount = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity || 0),
    0,
  );

  // Not logged in
  if (!userId) {
    return (
      <div className="min-h-screen bg-[#FAF8FF] flex items-center justify-center px-4 pt-24">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-sm p-8 text-center">
          <ShoppingCart size={55} className="mx-auto mb-5 text-[#3D348B]" />

          <h2 className="text-2xl font-bold text-[#3D348B]">Please Login</h2>

          <p className="text-gray-500 mt-3">
            Login to view and manage your shopping cart.
          </p>

          <Link
            to="/login"
            className="inline-flex mt-6 bg-[#3D348B] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2e276b] transition"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  //Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-lg test-gray-600">Loading Your Cart...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-[#3D348B]">Your Cart</h1>
          <p className="mt-3 text-red-500">
            Failed to load cart. Please check JSON server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] pt-28 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#7678ED] mb-2">
            EDUNEST / SHOPPING CART
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D348B]">
            My Shopping Cart
          </h1>

          <p className="text-gray-500 mt-2">
            Review your stationery items before checkout.
          </p>
        </div>

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-10 sm:p-16 text-center">
            <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-6">

              <ShoppingBag size={42} className="text-[#3D348B]" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Your cart is empty!
            </h2>

            <p className="text-gray-500 mt-3 max-w-md mx-auto">
              You haven't added any products yet. Explore our stationery
              collection and find your study essentials.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-7 bg-[#F7B801] text-[#3D348B] font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition"
            >
              <ShoppingBag size={19} />
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 mb-6 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Package size={28} className="text-[#3D348B]" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Items in your cart</p>

                <h2 className="text-2xl font-bold text-[#3D348B]">
                  {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </h2>
              </div>
            </div>

            {/* Cart Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Products */}
              <div className="lg:col-span-2 space-y-5">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-purple-100 p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-40 sm:h-32 shrink-0 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || "Product"}
                            className="w-full h-full object-contain p-3"
                          />
                        ) : (
                          <Package size={40} className="text-gray-400" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800">
                          {item.name || "Product"}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                          Product ID: {item.productId}
                        </p>

                        <p className="text-[#3D348B] font-bold text-lg mt-3">
                          ₹{Number(item.price || 0).toLocaleString("en-IN")}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                          <span className="text-sm text-gray-500">
                            Quantity:
                          </span>

                          <div className="flex items-center border border-purple-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item,
                                  Number(item.quantity || 1) - 1,
                                )
                              }
                              disabled={
                                Number(item.quantity) <= 1 ||
                                quantityMutation.isPending ||
                                removeMutation.isPending
                              }
                              aria-label="Decrease quantity"
                              className="p-2 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="min-w-10 text-center font-semibold text-gray-800">
                              {Number(item.quantity || 1)}
                            </span>

                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item,
                                  Number(item.quantity || 1) + 1,
                                )
                              }
                              disabled={
                                quantityMutation.isPending ||
                                removeMutation.isPending
                              }
                              aria-label="Increase quantity"
                              className="p-2 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item)}
                          disabled={
                            removeMutation.isPending ||
                            quantityMutation.isPending
                          }
                          className="inline-flex items-center gap-2 mt-4 text-red-500 hover:text-red-700 font-semibold text-sm disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="sm:text-right sm:min-w-28">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Subtotal
                        </p>

                        <p className="text-xl font-extrabold text-[#3D348B] mt-2">
                          ₹
                          {(
                            Number(item.price || 0) * Number(item.quantity || 0)
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continue Shopping */}
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-[#3D348B] font-semibold hover:text-[#7678ED] transition"
                >
                  <ArrowLeft size={18} />
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 sticky top-24">
                  <h2 className="text-xl font-extrabold text-[#3D348B]">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mt-6">
                    <div className="flex justify-between gap-3 text-gray-600">
                      <span>Total Items</span>
                      <span className="font-semibold">{totalQuantity}</span>
                    </div>

                    <div className="flex justify-between gap-3 text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3 text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex justify-between gap-3 items-center">
                      <span className="font-bold text-gray-800">
                        Total Amount
                      </span>

                      <span className="text-2xl font-extrabold text-[#3D348B]">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Checkout */}
                  <button
                    onClick={() => navigate("/checkout")}
                    disabled={
                      cart.length === 0 ||
                      quantityMutation.isPending ||
                      removeMutation.isPending
                    }
                    className="w-full mt-7 bg-[#3D348B] text-white font-bold py-3.5 rounded-xl hover:bg-[#2e276b] transition disabled:opacity-50"
                  >
                    Proceed to Checkout
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    Your study essentials are waiting!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
