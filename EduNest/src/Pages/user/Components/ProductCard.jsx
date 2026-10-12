import React, { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import ProductDetails from "./ProductDetails";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCartItem } from "../../../Api/cartApi";
import { toast } from "sonner";
import { addToWishlist, deleteWishlist, getWishlists } from "../../../Api/wishlistApi";

function ProductCard({ product }) {

//View Details
    const [showDetail, setShowDetail] = useState(false);

    const { data: wishlist=[] }=useQuery({
      queryKey: ["wishlists"],
      queryFn: getWishlists,
    });

    const wishlistItem = wishlist.find(
      (item) => String(item.productId) === String(product.id)
    );
    const isWishlisted = Boolean(wishlistItem);

    const addWishlistMutation = useMutation({
      mutationFn: addToWishlist,

      onSuccess: async () => {
        await queryClient.invalidateQueries({queryKey: ["wishlists"]})
        toast.success("Added to Wishlist!")
      },

      onError: () => {
        toast.error("Failed to add to Wishlist")
      },
    });

    const removeWishlistMutation = useMutation({
      mutationFn: deleteWishlist,

      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["wishlists"]});
        toast.success("Remove From Wishlist")
      },
    });

    const handleWishlist = () => {
      if(wishlistItem){
        removeWishlistMutation.mutate(wishlistItem.id);
      }else{
        addWishlistMutation.mutate(product)
      }
    };

//Save a cart item to JSON Server
  const queryClient = useQueryClient();

  const cartMutation = useMutation({
    mutationFn: addCartItem,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["carts"],
      });

      toast.success("Cart quantity updated!")

    },
    onError: (error) => {
      console.error("Cart save failed:", error);
      toast.error("Failed to add item to cart");
      
    },
  });

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
  
    return (
        <>
    <div className="bg-white rounded-2xl shadow-md overflow-hidden 
                    hover:shadow-xl transition duration-300">

      {/* Product Image */}
      <div className="relative bg-purple-100 h-56 flex items-center justify-center
                      overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-5
                      transition-transform duration-500 ease-out
                      group-hover:scale-110"
        />

        {/* Wishlist Button */}
        <button onClick={handleWishlist}
                disabled={addWishlistMutation.isPending || 
                          removeWishlistMutation.isPending
                }
                aria-label={
                  isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"
                }
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