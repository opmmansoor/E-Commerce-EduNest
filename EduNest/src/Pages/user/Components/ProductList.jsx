import React, { useMemo, useState } from 'react'
import ProductCard from './ProductCard'
import useProducts from '../../../hooks/useProduct'
import { ArrowUpDown, PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react';

function ProductList() {

    const {
        data: products = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useProducts();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sortBy, setSortBy] = useState("default");

//Get categories from JSON products     
    const categories = useMemo(() => {
        return[
            ...new Set(
                products.map((product) => product.category)
                .filter(Boolean)
            ),

        ].sort((a, b) => a.localeCompare(b));
    }, [products]);

// Search, filter and sort products    
    const filteredProducts = useMemo(() => {
        let result = [...products];

// Search by product name or category
        const searchText = search.trim().toLowerCase();

        if(searchText){
            result = result.filter((product) => 
            `${product.name || ""} ${product.category || ""}`
              .toLowerCase()
              .includes(searchText)
        );
        }

// Filter by category
      if(category !== "all"){
        result = result.filter(
            (product) => product.category === category
        );
      }

// Sort products
      switch(sortBy){
        case "price-low":
            result.sort((a, b) => Number(a.price) - Number(b.price));
            break;

        case "price-high":
            result.sort((a, b) => Number(b.price) - Number(a.price));
            break;

        case "name-asc":
            result.sort((a,b) =>
                (a.name || "").localeCompare(b.name || "")
            );
            break;
            
        case "name-desc":
            result.sort((a,b) => 
            (b.name || "").localeCompare(a.name || "")    
            );
            break;

         default:
            break;
      }

      return result;
    }, [products, search, category, sortBy]);

    const clearFilter = () => {
        setSearch("");
        setCategory("all");
        setSortBy("default")
    };

    if(isLoading){
        return (
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-[#3D348B]">  
                <p className='mt-4 text-gray-500'>
                    Loading EduNest Products...
                </p>
            </div>
        );
    }

    if(isError){
        return(
            <div className='rounded-2xl bg-white p-10 text-center shadow-sm'>
                <p className='text-red-500 mb-4'>
                    Failed to load products: {error.message}
                </p>

                <button onClick={() => refetch()}
                        className='rounded-xl bg-[#3D348B] px-5 py-3 font-semibold text-white hover:bg-[#2d276b]'>
                    Try Again
                </button>
            </div>
        );
    }

// Empty state
    if(products.length === 0){
        return(
            <div>
                <PackageSearch size={48}
                            className="mx-auto mb-4 text-gray-400"/>
                    <h2 className="text-xl font-bold text-gray-800">
                        No Products Available
                    </h2>
                    <p className="mt-2 text-gray-500">
                        Please check back later for our study essentials.
                    </p>
            </div>
        )
    }


    
  return (
    <section>
{/* Search and Filter Toolbar */}
        <div className='mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6'>

            <div className='mb-5 flex items-center gap-2'>
                <div className='rounded-lg bg-purple-100 p-2 text-[#3D348B]'>
                    <SlidersHorizontal size={20} />
                </div>

                <div>
                    <h2 className='font-bold text-gray-800'>
                        Find Your Essentials
                    </h2>
                    <p className='text-sm text-gray-500'>
                        Search, filter and sort your products
                    </p>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12'>
     {/* Search */}           
                <div className='relative xl:col-span-6'>
                    <Search size={20} 
                            className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'/>

                    <input type="search"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           placeholder='"Search notebooks, pens, bags...'
                           aria-label='Search products' 
                           className='w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm outline-none transition 
                                    focus:border-[#3D348B] focus:bg-white focus:ring-4 focus:ring-purple-100'/>
                </div>

     {/* Category Filter */}
                <div className='relative xl:col-span-3'>
                    <SlidersHorizontal size={17} 
                            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'/>

                    <select 
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          aria-label='Filter by Category'
                          className='w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-10 pr-4 text-sm 
                                    outline-none focus:border-[#3D348B] focus:ring-4 focus:ring-purple-100'>

                        <option value="all">All Categories</option>

                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

{/* Sorting */}
                <div className='relative xl:col-span-3'>
                    <ArrowUpDown size={17} 
                        className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'/>

                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        aria-lable="Sort products"
                        className='w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-10 pr-4 text-sm 
                                  outline-none focus:border-[#3D348B] focus:ring-4 focus:ring-purple-100'>

                        <option value="default">Recommended</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>

                    </select>    
                </div>           
            </div>

{/* Result Count and Clear */}
            <div className='mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4'>
                <p className='text-sm text-gray-500'>
                    Showing{" "}
                    <span className="font-bold text-[#3D348B]">
                        {filteredProducts.length}
                    </span>{" "}
                    of {products.length} products
                </p>

                {(search || category !== "all" || sortBy !== "default") && (
                    <button
                            onClick={clearFilter}
                            className='inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm 
                                        font-semibold text-[#3D348B] transition hover:bg-purple-50'>

                        <X size={16} />
                        Clear Filter
                    </button>
                )}
            </div>
        </div>

{/* Display product cards */}
    {filteredProducts.length > 0 ? (
       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
        ))} 
    </div>
    ) : (
        <div className='rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center'>
            <PackageSearch size={48} 
                        className='mx-auto mb-4 text-gray-400'/>
            <h2 className="text-xl font-bold text-gray-800">
                No matching products
            </h2>
                <p className="mt-2 text-gray-500">
                    Try another search or choose a different category.
                </p>
                <button
                        onClick={clearFilter}
                        className="mt-5 rounded-xl bg-[#3D348B] px-5 py-3 font-semibold text-white transition hover:bg-[#2d276b]">
                    Clear Filters
                </button>
        </div>
   )}
    </section>


  )
}

export default ProductList
