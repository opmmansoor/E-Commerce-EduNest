import React from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../Slice/cartSlice';
import { ShoppingCart, Star, X } from 'lucide-react';

function ProductDetails({ product, onClose }) {
    const dispatch = useDispatch();

    if(!product) return null;

    const handleAddToCart = () => {
        dispatch(addToCart(product))
        onClose()
    }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center 
                    bg-black/60 px-4'>
        <div className='relative w-full max-w-4xl max-h-[90vh] overflow-y-auto
                        rounded-2xl bg-white shadow-2xl'>
            <button onClick={onClose}
                    className='absolute right-4 top-4 z-10 flex h-10 w-10 bg-white items-center justify-center
                               rounded-full shadow-md text-gray-600 hover:bg-gray-100'>
                <X size={22}/>
            </button>

          <div className='grid md:grid-cols-2'>
            <div className='flex min-h-[350px] items-center justify-center bg-gray-100 p-8'>
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className='max-h-[350px] w-full object-contain'/>
            </div>

            <div className='p-8'>
                <p className='mb-2 text-sm font-medium uppercase tracking-wide text-orange-500'>
                    {product.category}
                </p>

                <h2 className="text-3xl font-bold text-[#3D348B]">
                    {product.name}
                </h2>
                <div className="mt-4 flex items-center gap-1">
                    <Star size={18}
                     className='fill-yellow-400 text-yellow-400'/>
                <span className='font-semibold'>
                    {product.rating || "4.5"}
                </span>
                <span className='text-gray-500'>
                    (Customer Rating)
                </span>               
                </div>

                <p className='mt-5 text-3xl font-bold text-orange-500'>
                    ₹{product.price}
                </p>

                <div className='mt-6'>
                    <h3 className='text-lg font-semibold text-gray-800'>
                        Description
                    </h3>

                    <p className='mt-2 leading-7 text-gray-600'>
                        {product.description || 
                        "Premium quality study essential designed for students. Perfect for everyday school and study needs."}
                    </p>
                </div>

                <div className='mt-6 space-y-2 border-t pt-5'>
                    <div className='flex justify-between'>
                        <span className='text-gray-500'>
                            Category
                        </span>
                        <span className='font-medium'>
                            {product.category || "Stationery"}
                        </span>
                    </div>

                    <div className='flex justify-between'>
                        <span className='text-gray-500'>
                            Availability
                        </span>
                        <span className='font-medium text-green-600'>
                            In Stock
                        </span>
                    </div>

                </div>
    {/* Add To Cart */}

                <button onClick={handleAddToCart}
                        className='mt-7 flex w-full items-center justify-center gap-2 rounded-xl 
                                   bg-orange-500 px-6 py-3 font-semibold text-white transition 
                                   hover:bg-orange-600'>
                    <ShoppingCart size={20}/>
                    Add to Cart
                </button>
            </div>
          </div>  
        </div>
      
    </div>
  )
}

export default ProductDetails
