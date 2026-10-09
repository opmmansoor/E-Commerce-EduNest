import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '../../../Slice/wishlistSlice';
import { addToCart } from '../../../Slice/cartSlice';
import { ArrowRight, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

function Wishlist() {
    const dispatch = useDispatch();
    const wishlist = useSelector((state) => state.wishlist.wishlist);

    const handleRemove = (id) => {
        dispatch(removeFromWishlist(id))
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    };

  return (
    <div className='min-h-screen bg-gray-50 px-4 sm:px-6 py-10'>
      <div className='max-w-7xl mx-auto'>


        <div>
            <div>
                <div>
                    <div>
                        <Heart size={10}/>
                    </div>

                    <h1 className='text-3xl font-bold text-gray-800 mb-4'>
                         My   
                    <span className='text-[#3D348B]'> WishList</span>
                    </h1>
                </div>

                <p>
                    Save your favorite study essentials for later.
                </p>
            </div>

            <Link to="/products"
                  className='inline flex items-center'>
            Continue Shopping 
            <ArrowRight size={10}/>
            </Link>
        </div>

        <div>
            <p>
                Saved Products
            </p>
            <p>
                {wishlist.length} {wishlist.length == 1 ? "item" : "items"}
            </p>
        </div>

{/* Empty */}
        {wishlist.length === 0 ? (
            <div>
                <div>
                    <Heart size={4}/>
                </div>

                <h2>
                    Your Wishlist is Empty
                </h2>
                <p>
                    Discover notebooks, pens, stationery and other study
                    essentials. Tap the heart on a product to save it here.
                </p>

                <Link to="/products">
                    Explore Products
                    <ArrowRight size={8}/>
                </Link>
            </div>
        
        ) : (
// wishlist products
            <div>
                {wishlist.map((product) => (
                    <div key={product.id}>
                        <div>
                            <img src={product.image} 
                                 alt={product.name} />

                            <button onClick={() => handleRemove(product.id)}>
                                <Heart size={10}/>
                            </button>
                        </div>

                        <div>
                            <p>
                                {product.category}
                            </p>

                            <h2>
                                {product.name}
                            </h2>

                            <p>
                                ₹{Number(product.price).toLocaleString("en-IN")}
                            </p>

                            <div>
                                <button onClick={() => handleRemove(product.id)}>
                                    <Trash2 size={25}/>
                                </button>

                                <button onClick={() => handleAddToCart(product)}
                                        disabled={product.stock === 0} 
                                        >
                                    <ShoppingCart />
                                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </button>
                            </div>

                            <Link to={`/products/${product.id}`}>
                                View Details
                            </Link>
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
