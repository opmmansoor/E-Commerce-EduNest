import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteCartItem, getCart } from '../../../Api/cartApi';
import { createOrder } from '../../../Api/orderApi';
import { toast } from 'sonner';

function Checkout() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.id

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
    });

//Fetch cart items
    const { data: cartItems = [], isLoading, isError} = useQuery({
        queryKey: ["carts", userId],
        queryFn: () => getCart(userId),
        enabled: Boolean(userId),
    });

//Calculate total price
    const total = cartItems.reduce(
        (sum,item) => sum + Number(item.price) * Number(item.quantity),
        0
    );
    
//Place order
    const orderMutation = useMutation({
        mutationFn: async () => {
            if(!cartItems.length){
                throw new Error("Your cart is empty")
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
                status: "Placed",
                createdAt: new Date().toISOString(),
            };
// Call existing order
            const savedOrder = await createOrder(orderData);

// Clear purchased cart
            await Promise.all(
                cartItems.map((item) => deleteCartItem(item.id))
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
            toast.error(error.message || "Failed to place order")
        },
    });

// Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

//Submit checkout form
    const handleSubmit = (e) => {
        e.preventDefault();

        if(!userId){
            toast.error("Please login first");
            navigate("/login");
            return;
        }

        if(!cartItems.length){
            toast.error("Your cart is empty");
            return
        }
        orderMutation.mutate();
    };

    if(!userId){
        return <p className="p-8">Please log in to continue.</p>
    }

    if(isLoading){
        return <p className="p-8">Loading checkout...</p>
    }

    if(isError){
        return <p className="p-8">Failed to load cart items.</p>
    }
    
    if(!cartItems.length){
        return(
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold"> Your cart is empty </h2>
                <button
                        onClick={() => navigate("/products")}
                         className="mt-4 rounded-lg bg-[#3D348B] px-6 py-3 text-white">
                    Browse Products
                </button>
            </div>
        )
    }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-[#3D348B]">
        Checkout
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
{/* delivery form */}
        <form onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl bg-white p-6 shadow"  >
            
            <h2 className="text-xl font-semibold">Delivery Details</h2>

            {[
                {name: "fullName", label: "Full Name"},
                { name: "phone", label: "Phone Number" },
                { name: "address", label: "Address" },
                { name: "city", label: "City" },
                { name: "pincode", label: "PIN Code" },
            ].map((field) => (
                <div key={field.name}>
                    <label className='mb-1 block text-sm font-medium'>
                         {field.label}
                    </label>

                    <input 
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                        className='w-full rounded-lg border p-3 outline-none focus:border-[#3D348B]' />
                       
                </div>
            ))}

            <button
                type='submit'
                disabled={orderMutation.isPending}
                className='w-full rounded-lg bg-[#3D348B] p-3 font-semibold text-white disabled:opacity-60'>

                {orderMutation.isPending ? "Placing Order..." : "Place Order"}
            </button>
        </form>

{/* Order summary */}
        <div className="h-fit rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold"> Order Summary </h2>
            
            {cartItems.map((item) => (
                <div 
                key={item.id}
                    className="flex justify-between gap-4 border-b py-3">

                    <span>
                        {item.name} × {item.quantity}
                    </span>

                    <span>
                        ₹{Number(item.price) * Number(item.quantity)}
                    </span>
                </div>
            ))}

            <div className="mt-5 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total}</span>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
