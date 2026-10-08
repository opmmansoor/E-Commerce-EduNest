import React from 'react'
import ProductList from '../Components/ProductList'

function Products() {
  return (
    <div className='min-h-Screen bg-gray-100'>
      <div className='max-w-7xl mx-auto px-5 py-10'>
        <h1 className='text-3xl font-bold text-[#3D348B] mb-2'>
          Explore EduNest Products
        </h1>
        <p className='text-gray-600 mb-8'>
          Explore our premium stationery and study essentials.
        </p>
        <ProductList />
      </div>
    </div>
  )
}

export default Products
