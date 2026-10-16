import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCartItem, getCart } from "../../../Api/cartApi";
import { createOrder } from "../../../Api/orderApi";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";

function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id != null ? String(user.id) : null;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  //Fetch cart items
  const {
    data: cartItems = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["carts", userId],
    queryFn: () => getCart(userId),
    enabled: Boolean(userId),
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [upiId, setUpiId] = useState("");

  //Calculate total price
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  //Place order
  const orderMutation = useMutation({
    mutationFn: async () => {
      if (!cartItems.length) {
        throw new Error("Your cart is empty");
      }

      const orderData = {
        userId,
        items: cartItems.map((item) => ({
          cartItemId: item.id,
          productId: item.productId,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image,
        })),

        totalAmount: total,
        shippingAddress: formData,

        paymentMethod,
        paymentStatus: "Pending",

        // Demo UPI details:
        ...(paymentMethod === "UPI" && { upiId }),
        status: "Placed",
        createdAt: new Date().toISOString(),
      };

      // Call existing order
      const savedOrder = await createOrder(orderData);

      // Clear purchased cart
      await Promise.all(
        cartItems.map((item) => deleteCartItem({ id: item.id, userId })),
      );
      return savedOrder;
    },

    onSuccess: async (order) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["carts", userId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["orders", userId],
        }),
      ]);

      toast.success("Order placed successfully!");

      // Navigate to Order Success page
      navigate(`/order-success/${order.id}`);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to place order");
    },
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  //Submit checkout form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }
    orderMutation.mutate();
  };

  if (!userId) {
    return (
      <div className="min-h-[70vh] bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <UserRound className="mx-auto mb-4 text-[#3D348B]" size={48} />
          <h2 className="text-2xl font-bold text-gray-900">Login Required</h2>

          <p className="mt-2 text-gray-500">
            Please log in to continue with your checkout.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-xl bg-[#3D348B] px-5 py-3 font-semibold text-white transition hover:bg-[#30286f]"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#3D348B]" />

          <p className="mt-4 font-medium text-gray-600">
            Preparing your checkout...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
            <ShoppingBag size={38} className="text-[#3D348B]" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-gray-500">
            Add your favourite study essentials before checking out.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3D348B] px-6 py-3 font-semibold text-white transition hover:bg-[#30286f]"
          >
            Browse Products <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
            <ShoppingBag size={38} className="text-[#3D348B]" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-gray-500">
            Add your favourite study essentials before checking out.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3D348B] px-6 py-3 font-semibold text-white transition hover:bg-[#30286f]"
          >
            Browse Products <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#3D348B] focus:bg-white focus:ring-4 focus:ring-indigo-100";

  return (
    <div className="min-h-screen bg-[#F7F8FC] pb-16">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/Cart")}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#3D348B]"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </button>

          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <ShieldCheck size={20} />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Page title */}
        <div className="mb-9">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            EduNest Store
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#211B4D] sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-gray-500">
            Just a few details and your study essentials will be on their way.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-9 flex max-w-xl items-center">
          <div className="flex items-center gap-2 text-[#3D348B]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3D348B] text-white">
              <CheckCircle2 size={19} />
            </span>
            <span className="text-sm font-semibold">Cart</span>
          </div>

          <div className="mx-3 h-px flex-1 bg-[#3D348B]" />

          <div className="flex items-center gap-2 text-[#3D348B]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3D348B] text-sm font-bold text-white">
              2
            </span>
            <span className="text-sm font-semibold">Checkout</span>
          </div>

          <div className="mx-3 h-px flex-1 bg-gray-200" />

          <div className="flex items-center gap-2 text-gray-400">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
              3
            </span>
            <span className="text-sm font-medium">Confirmation</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_390px]">
            {/* Left column */}
            <div className="space-y-6">
              {/* Delivery details */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                <div className="mb-7 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[#3D348B]">
                    <MapPin size={23} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Delivery Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Full name */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <UserRound
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400">
                      Enter your 10-digit mobile number.
                    </p>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      House / Street Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      autoComplete="street-address"
                      placeholder="House number, street, area..."
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* PIN code */}
                  <div>
                    <label
                      htmlFor="pincode"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      PIN Code
                    </label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="6-digit PIN code"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              {/* Delivery and */}
              {/* Payment Method */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <CreditCard size={23} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Payment Method
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose how you want to pay.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <label
                    className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition ${
                      paymentMethod === "COD"
                        ? "border-[#3D348B] bg-indigo-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="mt-1 h-4 w-4 accent-[#3D348B]"
                    />

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                      <Truck size={25} />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-gray-900">
                          Cash on Delivery
                        </h3>
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                          Recommended
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        Pay in cash when your EduNest order arrives.
                      </p>
                    </div>
                  </label>

                  {/* UPI Demo */}
                  <label
                    className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition ${
                      paymentMethod === "UPI"
                        ? "border-[#3D348B] bg-indigo-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                      className="mt-1 h-4 w-4 accent-[#3D348B]"
                    />

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                      <CreditCard size={25} />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-gray-900">UPI Payment</h3>
                        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
                          Demo Only
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        Select this option to demonstrate a UPI checkout flow.
                        No money will be transferred.
                      </p>
                    </div>
                  </label>

                  {/* UPI ID field */}
                  {paymentMethod === "UPI" && (
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                      <label
                        htmlFor="upiId"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Demo UPI ID
                      </label>

                      <input
                        id="upiId"
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value.trim())}
                        placeholder="example@upi"
                        required
                        pattern="[A-Za-z0-9._-]+@[A-Za-z0-9.-]+"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#3D348B] focus:ring-4 focus:ring-indigo-100"
                      />

                      <p className="mt-2 text-xs leading-5 text-gray-500">
                        This is a demonstration field only. Do not enter
                        sensitive payment information. No payment is processed.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right column - Order summary */}
            <aside className="lg:sticky lg:top-24">
              <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      Order Summary
                    </h2>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-[#3D348B]">
                      {totalItems} items
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="max-h-80 space-y-5 overflow-y-auto p-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-2">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Package size={30} className="text-gray-300" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="mt-2 font-bold text-[#3D348B]">
                          ₹
                          {(
                            Number(item.price) * Number(item.quantity)
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="border-t border-dashed border-gray-200 p-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between text-gray-500">
                      <span>Delivery</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                  </div>

                  <div className="my-5 border-t border-gray-100" />

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900">Total Amount</p>
                      <p className="mt-1 text-xs text-gray-400">
                        Inclusive of listed prices
                      </p>
                    </div>
                    <p className="text-2xl font-extrabold text-[#3D348B]">
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={orderMutation.isPending}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D348B] px-5 py-4 font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-[#30286f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {orderMutation.isPending ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Confirm Order
                        <ArrowRight size={19} />
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
                    <ShieldCheck size={16} className="text-green-600" />
                    Your delivery details are used to process this order.
                  </div>
                </div>
              </section>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="mt-5 flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold text-[#3D348B] transition hover:text-orange-500"
              >
                <ArrowLeft size={17} />
                Continue Shopping
              </button>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
