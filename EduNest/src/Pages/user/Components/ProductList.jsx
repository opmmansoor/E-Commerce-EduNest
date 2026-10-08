import React from 'react'
import ProductCard from './ProductCard'
import useProducts from '../../../hooks/useProduct'

function ProductList() {

    const {
        data: products,
        isLoading,
        isError,
        error,
        refetch,
    } = useProducts();

    if(isLoading){
        return (
            <p className='py-10 text-center text-gray-500'>
                Loading Products...
            </p>
        )
    }

    if(isError){
        return(
            <div className='py-10 text-center'>
                <p className='text-red-500 mb-3'>
                    Failed to load products: {error.message}
                </p>

                <button onClick={() => refetch()}
                        className='rounded-lg bg-orange-500 px-4 py-2 text-white'>
                    Try Again
                </button>
            </div>
        )
    }

// Empty state
    if(!products || products.length === 0){
        return(
            <p>
                No Products Available.
            </p>
        )
    }

//Display product cards
    
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  )
}

export default ProductList
