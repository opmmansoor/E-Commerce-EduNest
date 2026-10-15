import React, { useState } from 'react'
import { ArrowRight, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteWishlist, getWishlists } from '../../../Api/wishlistApi';
import { toast } from 'sonner';
import { addCartItem } from '../../../Api/cartApi';
import ProductDetails from '../Components/ProductDetails';

function Wishlist() {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const queryClient = useQueryClient()

    const { data : wishlist=[], isLoading, isError } = useQuery({
        queryKey: ["wishlists"],
        queryFn: getWishlists,
    })

//Remove from wishlist
    const removeMutation = useMutation({
        mutationFn: deleteWishlist,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlists"]})
        toast.success("Removed from wishlist")
        },
        onError: () => toast.error("Failed to Remove item")
    })
    
//Add product to cart
     const cartMutation = useMutation({ 
        mutationFn: addCartItem, 
    
        onSuccess: () => { 
            queryClient.invalidateQueries({ queryKey: ["carts"] });
             toast.success("Added to cart!"); 
        }, 
        onError: () => 
            toast.error("Failed to add to cart"),
     });
       
    const handleAddToCart = (product) => {
         cartMutation.mutate({ 
            productId: product.productId, 
            name: product.name, 
            price: product.price, 
            image: product.image, 
            quantity: 1, 
        }); 
    }; 
    
    if (isLoading) {
         return <div className="p-10 text-center">Loading wishlist...</div>; 
    } 
    
    if (isError) {
         return (
             <div className="p-10 text-center text-red-500"> 
                 Failed to load wishlist. Check JSON Server. 
             </div> 

        ); 
    }

  return (
    <div className='min-h-screen bg-gray-50 px-4 sm:px-6 py-30'>
      <div className='max-w-7xl mx-auto'>


        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
            <div>
                <div className='flex items-center gap-3 mb-2'>
                    <div className='bg-purple-100 text-[#3D348B] p-3 rounded-xl'>
                        <Heart size={28}/>
                    </div>

                    <h1 className='text-3xl sm:text-4xl font-bold text-gray-800'>
                         My   
                    <span className='text-[#3D348B]'> WishList</span>
                    </h1>
                </div>

                <p className='text-gray-500'>
                    Save your favorite study essentials for later.
                </p>
            </div>

            <Link to="/products"
                  className='inline-flex items-center justify-center gap-2 rounded-xl
                             bg-[#3D348B] text-white px-5 py-3  font-semibold hover:bg-[#2d276b] transition'>
            Continue Shopping 
            <ArrowRight size={18}/>
            </Link>
        </div>

{/* Count */}
        <div className='bg-white border border-gray-100 rounded-2xl p-5 mb-8 shadow-sm'>
            <p className='text-gray-500 text-sm'>
                Saved Products
            </p>
            <p className='text-2xl font-bold text-[#3D348B]'>
                {wishlist.length} {wishlist.length == 1 ? "item" : "items"}
            </p>
        </div>

{/* Empty */}
        {wishlist.length === 0 ? (
            <div className='bg-white rounded-3xl border border-gray-100 
                            shadow-sm py-14 px-6 text-center'>
                
                    <Heart size={44} className='mx-auto mb-5 text-[#3D348B]'/>
                
                <h2 className='text-2xl font-bold text-gray-800 mb-3'>
                    Your Wishlist is Empty
                </h2>
                <p className='text-gray-500 max-w-md mx-auto mb-7'>
                    Discover notebooks, pens, stationery and other study essentials. 
                    Tap the heart on a product to save it here.
                </p>

                <Link to="/products"
                       className='inline-flex items-center gap-2 bg-[#F35B04] text-white px-7 py-3
                                  rounded-xl font-semibold hover:bg-orange-600 transition'>
                    Explore Products
                    <ArrowRight size={18}/>
                </Link>
            </div>
        
        ) : (
// wishlist products
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {wishlist.map((product) => (
                    <div key={product.id}
                         className='bg-white rounded-2xl overflow-hidden border border-gray-100 
                                    shadow-sm hover:shadow-lg transition duration-300'>
                        
                        <div className='relative h-56 bg-gray-100 flex items-center justify-center p-5'>
                            
                            <img src={product.image} 
                                 alt={product.name} 

                                  className='max-h-full max-w-full object-contain'/>

                            <button onClick={() => removeMutation.mutate(product.id)}
                                    disabled={removeMutation.isPending}
                                     aria-label= {`Remove ${product.name} from wishlist`}
                                     
                                     className='absolute top-3 right-3 p-2.5 bg-white rounded-full shadow 
                                                hover:bg-red-50 text-red-500 transition'>
                                <Heart size={18} className='fill-red-500'/>
                            </button>
                        </div>

{/* Product Details */}
                        <div className='p-5'>
                            <p className='text-sm text-gray-500 mb-1'>
                                {product.category}
                            </p>

                            <h2 className='text-lg font-bold text-gray-800 truncate'>
                                {product.name}
                            </h2>

                            <p className='text-2xl font-bold text-[#3D348B] mt-3'>
                                ₹{Number(product.price).toLocaleString("en-IN")}
                            </p>

                            <div className='flex gap-2 mt-5'>
                                <button onClick={() => removeMutation.mutate(product.id)}
                                        disabled={removeMutation.isPending}
                                        className='flex items-center justify-center gap-1 border border-gray-200 
                                                    text-gray-600 px-3 py-2.5 rounded-lg hover:bg-red-100 transition'
                                                     
                                        aria-label='Remove from Wishlist'>
                                    <Trash2 size={17}/>
                                </button>

                                <button onClick={() => handleAddToCart(product)}
                                        disabled={cartMutation.isPending} 
                                        className='flex-1 flex items-center justify-center gap-2 bg-[#F35B04] text-white py-2.5
                                                   rounded-lg font-semibold hover:bg-orange-600
                                                   disabled:bg-gray-400 transition'>
                                    <ShoppingCart size={18}/>
                                    Add to Cart
                                </button>
                            </div>

                            <button onClick={() => setSelectedProduct(product)}
                                    className='block text-center text-[#3D348B] font-semibold text-sm mt-4 hover:underline'>
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
