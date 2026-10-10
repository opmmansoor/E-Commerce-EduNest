import React, { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../Slice/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../../Slice/wishlistSlice";
import ProductDetails from "./ProductDetails";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCartItem } from "../../../Api/cartApi";
import { toast } from "sonner";

function ProductCard({ product }) {

    const dispatch = useDispatch()

//View Details
    const [showDetail, setShowDetail] = useState(false);

    const wishlist = useSelector((state) => state.wishlist.wishlist);
    const isWishlisted =wishlist.some((item) => item.id === product.id);

    

//Save a cart item to JSON Server
  const queryClient = useQueryClient();

  const cartMutation = useMutation({
    mutationFn: addCartItem,

    onSuccess: () => {
//update redux after success
      dispatch(addToCart(product))

// Refresh cart data      
      queryClient.invalidateQueries({
        queryKey: ["carts"],
      })

//for notification on ADD
      toast.success("Item Added to  Cart!")
    },
    onError: (error) => {
      console.error("Cart save failed:", error);
      console.error("Server response:", error.response?.data)
      
      toast.error( error.response?.data?.message ||
            "Failed to ad item. Check JSON Server."
      )
    }
  })

//Add To Cart 
  const handleAddToCart = () => {
    cartMutation.mutate({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

//Add/remove wishlist
  const handleWishlist  = () => {
        if (isWishlisted) {
            dispatch(removeFromWishlist(product.id));
        }else{
            dispatch(addToWishlist(product))
        }
    }  
  
    return (
        <>
    <div className="bg-white rounded-2xl shadow-md overflow-hidden 
                    hover:shadow-xl transition duration-300">

      {/* Product Image */}
      <div className="relative bg-gray-100 h-56 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-5"
        />

        {/* Wishlist Button */}
        <button onClick={handleWishlist}
                aria-label="Toggle wishlist"
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-50">
          <Heart
            size={20}
             className= {
                isWishlisted? "fill-red-500 text-red-500" : "text-red-500"
             }/>
        </button>
        <h3>{[product.title]}</h3>
      </div>

      {/* Product Information */}
      <div className="p-5">

        {/* Category */}
        <p className="text-sm text-gray-500 mb-1">
          {product.category}
        </p>

        {/* Product Name */}
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>

        {/* Price */}
        <p className="text-xl font-bold text-orange-600 mt-2">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        {/* Stock */}
        <p className="text-sm mt-2">
          {product.stock > 0 ? (
            <span className="text-green-600">
              In Stock ({product.stock})
            </span>
          ) : (
            <span className="text-red-500">
              Out of Stock
            </span>
          )}
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">

          {/* View Details */}
          <button onClick={() => setShowDetail(true)}
            className="flex-1 text-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            View Details
          </button>

          {/* Add To Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || cartMutation.isPending}
            className="flex items-center justify-center gap-1 bg-orange-500 text-white px-3 py-2 rounded-lg 
                        hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            <ShoppingCart size={18} />
           {cartMutation.isPending ? "Saving..." : "Add"}
          </button>
        </div>

        {cartMutation.isError &&(
          <p className="mt-2 text-sm text-red-500">
            Failed to save item. Please try again.
          </p>
        )}
      </div>
    </div>

{/* Product Details Modal */}
          {showDetail && (
            <ProductDetails
            product={product}
            onClose={() => setShowDetail(false)}/>
          )}
    </>
  );
}

export default ProductCard;