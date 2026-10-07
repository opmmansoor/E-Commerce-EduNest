// import React from 'react'
// import { Link } from 'react-router-dom'
// import { ShoppingCart, Heart } from "lucide-react";



// function ProductCard({product}) {
//   return (
//     <div>

// {/* Product Image */}
//       <div className="">
//         <img
//           src={product.image}
//           alt={product.name}
//           className=""
//         />

// {/* Wishlist Button */}
//         <button className="">
//           <Heart
//             size={20}
//             className=""
//           />
//         </button>
//       </div>

// {/* Product Information */}
//       <div className="">

// {/* Category */}
//         <p className="">
//           {product.category}
//         </p>

// {/* Product Name */}
//         <h2 className="">
//           {product.name}
//         </h2>

// {/* Price */}
//         <p className="">
//           ₹{product.price.toLocaleString("en-IN")}
//         </p>

// {/* Stock */}
//         <p className="">
//           {product.stock > 0 ? (
//             <span className="">
//               In Stock ({product.stock})
//             </span>
//           ) : (
//             <span className="">
//               Out of Stock
//             </span>
//           )}
//         </p>

// {/* Buttons */}
//         <div className="">

// {/* View Details */}
//           <Link
//             to={`/products/${product.id}`}
//             className=""
//           >
//             View Details
//           </Link>

// {/* Add To Cart */}
//           <button
//             disabled={product.stock === 0}
//             className="flex items-center justify-center gap-1 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
//           >
//             <ShoppingCart size={18} />
//             Add
//           </button>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductCard





import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">

      {/* Product Image */}
      <div className="relative bg-gray-100 h-56 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-5"
        />

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-50">
          <Heart
            size={20}
            className="text-red-500"
          />
        </button>
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
          <Link
            to={`/products/${product.id}`}
            className="flex-1 text-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            View Details
          </Link>

          {/* Add To Cart */}
          <button
            disabled={product.stock === 0}
            className="flex items-center justify-center gap-1 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            <ShoppingCart size={18} />
            Add
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductCard;