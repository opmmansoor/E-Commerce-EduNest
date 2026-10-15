import React from 'react'
import ProductList from '../Components/ProductList'
import { BookOpen } from 'lucide-react'

function Products() {
  return (
    <div className='min-h-Screen bg-purple-100/50'>
      <div className='max-w-7xl mx-auto px-4 py-30 sm:px-6 lg:px-8'>
        
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full 
                      bg-purple-100 px-4 py-2 text-sm font-semibold text-[#3D348B]">
           
           <BookOpen size={17} />
            EduNest Study Essentials
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#3D348B] sm:text-4xl">
            Explore Our Products
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Discover quality notebooks, pens, stationery,
            school accessories and everything you need to study smarter.
          </p>
        </div>

        <ProductList />
      </div>
    </div>
  )
}

export default Products
