
import React from 'react'
import { clearCart, decreaseQuantity, increaseQuantity, removeFromCart } from '../../../Slice/cartSlice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCartItem, getCart } from '../../../Api/cartApi';
import { toast } from 'sonner';
import { Minus, Plus, ShoppingCart, Trash, Trash2 } from 'lucide-react';

const API = "http://localhost:3000/carts"

function Cart() {

    const queryClient = useQueryClient();

    const {
        data: cart = [], isLoading, isError, } = useQuery({
            queryKey: ["carts"],
            queryFn: getCart,
        });

// Update quantity in JSON Server
    const updateQuantityMutation = useMutation({
        mutationFn: async ({ id, quantity }) => {
            const response = await axios.patch(`${API}/${id}`,{
                quantity,
            });
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["carts"] });
        },
        onError: () => {
            toast.error("Failed to update quantity")
        },
    });

//Remove item from JSON
    const removeMutation = useMutation({
        mutationFn: deleteCartItem,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["carts"] });

            toast.success("Item removed from Cart");
        },
        onError: () => {
            toast.error("Failed to remove item")
        },
    })  

// Clear the entire cart
    const clearCartMutation = useMutation({
        mutationFn: async () => {
            await Promise.all(
                cart.map((item) => 
                deleteCartItem(item.id))
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["carts"] });
            toast.success("Cart cleared Successfully")
        },
        onError: () => {
            queryClient.invalidateQueries({queryKey: ["carts"] });
            toast.error("Failed to clear cart")
        },
    });

    const increaseQuantity = (item) => {
        if(item.quantity > 1){
            updateQuantityMutation.mutate({
                id: item.id,
                quantity: item.quantity - 1
            });
        }
    }

    const totalPrice = cart.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
    );

//Loading State
    if(isLoading) {
        return (
            <div className='min-h-screen bg-gray-100 px-5 py-10'>
                <div className='mx-auto max-w-6xl'>
                    <p className='text-lg test-gray-600'>
                        Loading Your Cart...
                    </p>
                </div>
            </div>
        )
    }

// Error State
    if(isError){
        return(
            <div className="min-h-screen bg-gray-100 px-5 py-10" >
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-3xl font-bold text-[#3D348B]">
                        Your Cart
                    </h1>
                    <p className="mt-3 text-red-500">
                        Failed to load cart. Please check JSON server.
                    </p>
                </div>
            </div>
        )
    }

    if(cart.length === 0){
        return(
            <div className='min-h-screen bg-gray-100 px-5 py-10'>
                <div className='max-w-6xl mx-auto'>
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                        
                        <ShoppingCart size={55} 
                                      className='mx-auto mb-4 text-[#3D348B]'/>
                        <h1 className="text-3xl font-bold text-[#3D348B]">
                            Your Cart
                        </h1>

                        <p className='text-gray-600  mt-2'>
                        Your cart is currently empty.
                        </p>
                    </div>
                </div>
            </div>
        )
    }


  return (
    <div className='min-h-screen bg-gray-100 px-5 py-10'>
      <div className='max-w-6xl mx-auto'>
        
        <div className='flex justify-between items-center mb-8'>
            <div>
                <h1 className='text-3xl font-bold text-[#3D348B]'>
                    Your Cart
                </h1>
                <p className='text-gray-600 mt-2'>
                    Review your selected products.
                </p>
            </div>

            <button onClick={() => clearCartMutation.mutate}
                    disabled={clearCartMutation.isPending}
                    className='flex items-center gap-2 bg-red-500  text-white 
                                px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50'>
                <Trash size={18} />
                
                {clearCartMutation.isPending? "Clearing...": "Clear Cart"}
            </button>
        </div>

        <div className='space-y-4'>

            {cart.map((item) => (
            <div
                key={item.id}
                className='bg-white rounded-xl shadow-md p-4 flex flex-wrap 
                            items-center gap-5 '>
            
            
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className='w-24 h-24 object-contain rounded-lg bg-gray-100'/>

                <div className='flex-1'>
                    <h2 className='text-lg font-semibold text-gray-800'>
                        {item.name}
                    </h2>

                    <p className='mt-1 font-bold text-orange-500'>
                        ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>

                    <p className='mt-1 text-sm text-gray-500'>
                        Subtotal: ₹
                        {(Number(item.price) * Number(item.quantity))
                         .toLocaleString("en-IN")}
                    </p>
                </div>

      {/* Quantity */}
                <div className='flex items-center gap-3'>
                    <button onClick={() => decreaseQuantity(item)}
                            disabled={
                                item.quantity <= 1 || updateQuantityMutation.isPending
                            }
                            aria-label='Decrease Quantity'
                            className='flex w-9 h-9 items-center justify-center rounded-lg 
                                        bg-blue-200 font-bold disabled:opacity-40'>
                        <Minus size={16}/>
                    </button>

                    <span className='min-w-5 text-center font-semibold'>
                        {item.quantity}
                    </span>

                    <button onClick={() => increaseQuantity(item)}
                            disabled={updateQuantityMutation.isPending}
                            aria-label='Increase Quantity'
                            className='flex h-9 w-9 items-center justify-center bg-blue-200 
                                        rounded-lg font-bold disabled:opacity-40'>
                        <Plus  size={16}/>
                    </button>
                </div>


       {/* Remove */}
                <button onClick={() => removeMutation.mutate(item.id)}
                        disabled={removeMutation.isPending}
                        className='flex items-center gap-2 px-3 py-2
                                 text-white font-semibold bg-red-500 rounded-lg  hover:bg-red-800 disabled:opacity-50'>
                    <Trash2 size={16} />
                    Remove
                </button>         
            </div>
        ))}

        </div>

       {/* Total */}
            <div className='mt-8 bg-white rounded-xl shadow-md p-6 flex justify-between items-center'>
                <div>
                <h2 className='text-xl font-bold text-gray-800'>
                    Total
                </h2>

                <p className='mt-1 text-sm text-gray-500'>
                    {cart.length} different item(s)
                </p>
                </div>

                <p className='text-2xl font-bold text-[#3D348B]'>
                   ₹{totalPrice.toLocaleString("en-IN")} 
                </p>
            </div>

      </div>
    </div>
  )
}

export default Cart
