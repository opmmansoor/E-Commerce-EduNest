import React from 'react'
import ProductCard from './ProductCard'

function ProductList() {
    const products = [
        {
    id: "1",
    name: "Premium Notebook",
    category: "Notebooks",
    price: 299,
    stock: 25,
    image: "/images/notebook.jpg",
  },
  {
    id: "2",
    name: "Premium Notebook",
    category: "Notebooks",
    price: 2992,
    stock: 25,
    image: "/images/notebook.jpg",
  }
    ];
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
