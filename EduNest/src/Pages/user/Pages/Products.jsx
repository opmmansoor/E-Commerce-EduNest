import React from 'react'
import ProductList from '../Components/ProductList'

function Products() {
  return (
    <div className='min-h-Screen bg-'>
      <div>
        <h1>
          Our Products
        </h1>
        <p>
          Explore our premium stationery and study essentials.
        </p>
        <ProductList />
      </div>
    </div>
  )
}

export default Products
