
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, decreaseQuantity, increaseQuantity, removeFromCart } from '../../../Slice/cartSlice';


function Cart() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    if(cart.length === 0){
        return(
            <div className='min-h-screen bg-gray-100 px-5 py-10'>
                <div className='max-w-6xl mx-auto'>
                    <h1 className="text-3xl font-bold text-[#3D348B]">
                        Your Cart
                    </h1>

                    <p className='text-gray-600  mt-2'>
                        Your cart is currently empty.
                    </p>
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

            <button onClick={() => dispatch(clearCart())}
                    className='bg-red-500  text-white px-4 py-2 rounded-lg hover:bg-red-700 '>
                Clear Cart
            </button>
        </div>

        <div className='space-y-4'>

            {cart.map((item) => (
            <div
                key={item.id}
                className='bg-white rounded-xl shadow-md p-4 flex items-center gap-5 '>
            
            
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className='w-24 h-24 object-contain rounded-lg bg-gray-100'/>

                <div className='flex-1'>
                    <h2 className='text-lg font-semibold text-gray-800'>
                        {item.name}
                    </h2>

                    <p className='text-orange-500  font-bold mt-1'>
                        ₹{item.price}
                    </p>
                </div>

      {/* Quantity */}
                <div className='flex items-center gap-3'>
                    <button onClick={() => dispatch(decreaseQuantity(item.id))}
                            className='w-8 h-8 rounded bg-blue-200 font-bold'>
                        -
                    </button>

                    <span className='font-semibold'>
                        {item.quantity}
                    </span>

                    <button onClick={() => dispatch(increaseQuantity(item.id))}
                            className='w-8 h-8 bg-blue-200 rounded font-bold'>
                        +
                    </button>
                </div>


       {/* Remove */}
                <button onClick={() => dispatch(removeFromCart(item.id))}
                        className='text-white font-semibold bg-red-500 rounded-lg px-2 py-1 hover:bg-red-800'>
                    Remove
                </button>         
            </div>
        ))}

        </div>

       {/* Total */}
            <div className='mt-8 bg-white rounded-xl shadow-md p-6 flex justify-between items-center'>
                <h2 className='text-xl font-bold text-gray-800'>
                    Total
                </h2>

                <p className='text-2xl font-bold text-[#3D348B]'>
                   ₹{totalPrice} 
                </p>
            </div>

      </div>
    </div>
  )
}

export default Cart
