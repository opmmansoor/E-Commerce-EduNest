import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react'
import { addProduct, deleteProduct, getProducts, updateProduct } from '../../../Api/productApi';
import { Package, Pencil, RefreshCcw, Search, Trash2, X } from 'lucide-react';

export default function AdminProducts() {
    const quertClient = useQueryClient();

    const emptyForm = {
        name: "",
        category: "",
        price: "",
        stock: "",
        image: "",
        description: "",
    };

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");

    const pageSize = 8;

//fetch product 
    const {data: products = [], isLoading, isError, error, refetch,} = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });
// Refresh cached data
    const refreshProducts = () => 
        quertClient.invalidateQueries({queryKey: ["products"] });

    const addMutation = useMutation({
        mutationFn: addProduct,
        onSuccess: async () => {
            await refreshProducts();
            closeModal();
        },
    });

    const editMutation = useMutation({
        mutationFn: updateProduct,
        onSuccess: async () => {
            await refreshProducts();
            closeModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: refreshProducts,
    });

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setForm(emptyForm);
        setFormError("");
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setForm(emptyForm);
        setFormError("");
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name || product.title || "",
            category: product.category || "",
            price: String(product.price ?? ""),
            stock: String(product.stock ?? ""),
            image: product.image || "",
            description: product.description || "",
        });
        setFormError("");
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError("");

        if(
            !form.name.trim() || 
            !form.category.trim() || 
            !form.price === "" ||
            !form.stock === ""
        ) {
            setFormError("Please fill in all required fields.");
            return;
        }

        const price = Number(form.price);
        const stock = Number(form.stock);

        if (
            !Number.isFinite(price) ||
            !Number.isInteger(stock) ||
            price < 0 ||
            stock < 0
          ) {
        setFormError("Enter a valid price and whole-number stock quantity.");
        return;
        }

        const productData = {
            name: form.name.trim(),
            category: form.name.trim(),
            price,
            stock,
            image: form.image.trim(),
            description: form.description.trim(),
        };

        if(editingProduct) {
            editMutation.mutate({
                id: editingProduct.id,
                product: productData,
            });
        } else {
            addMutation.mutate(productData);
        }
    };

    const categories = useMemo(
        () => [
            "All",
            ...new Set(
                products.map((p) => p.category).filter(Boolean)
            ),
        ],
        [products]
    );

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const name = product.name || product.title || "";
            const matchesSearch = name
            .toLowerCase()
            .includes(search.toLowerCase());

            const matchesCategory = 
                category === "All" || product.category === category;

                return matchesSearch && matchesCategory;
        });
    },[products, search, category]);


    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / pageSize)
    );
    const currentPage = Math.min(page, totalPages);

    const pageProducts = filteredProducts.slice(
        (currentPage -1) * pageSize,
        currentPage * pageSize
    );

    const lowStock = products.filter(
        (p) => Number(p.stock) > 0 && Number(p.stock) <= 5
    ).length;


    const inventoryValue = products.reduce(
        (sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0),
        0
    );

    const saving = addMutation.isPending || editMutation.isPending;


  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#3D348B]/10 p-3 text-[#3D348B]">
            <Package size={28} />
          </div>
            <div>
                <h2 className="text-2xl font-bold text-[#211B4D]">
                Products
                </h2>

                <p className="text-sm text-gray-500">
                 Manage your EduNest store inventory
                </p>
            </div>
        </div>

        <button onClick={openAddModal}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#3D348B] px-5 py-3 font-semibold text-white hover:bg-[#211B4D]">
            Add New product
        </button>
      </div>

{/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
            { label: "Total Products", value: products.length },
            {
                label: "In Stock",
                value: products.filter((p) =>  Number(p.stock) > 5).length,
            },
            { label: "Low Stock", value: lowStock },
            {
                label: "Inventory Value",
                value: `₹${inventoryValue.toLocaleString("en-IN")}` ,
            },
        ].map((stat) => (
            <div 
             key={stat.label}
             className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm' >

                <p  className="text-sm text-gray-500">{stat.label}</p>
                <h3 className="mt-3 text-2xl font-bold text-[#211B4D]">
                    {stat.value}
                </h3>
            </div>    
        ))}
      </div>

{/* Table container */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row">
            <div className="relative flex-1">
                <Search size={19} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>

                <input value={search}
                       onChange={(e) => {
                        setSearch(e.target.value)
                                setPage(1)
                       }}
                        placeholder='Search Products...'
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-[#3D348B]"/>        
            </div>

            <select value={category}
                    onChange={(e) => {
                        setCategory(e.target.value)
                        setPage(1)
                    }}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#3D348B]">

                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item === "All" ? "All Categories" : item} 
                        </option>
                    ))}
            </select>

            <button onClick={() => {
                setSearch("");
                setCategory("All");
                setPage(1);
                refetch();
            }}
                    className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-gray-600 hover:bg-gray-50">
                <RefreshCcw size={16} />
                reset
            </button>
        </div>

        {isLoading ? (
            <p className="p-12 text-center text-gray-500">
                Loading Product...
            </p>
        ) : isError ? (
            <div className="p-8 text-center text-red-600">
                <p>{error?.message || "Unable to load products."}</p>
                <button>
                    Try again
                </button>
            </div>
        ) : (
            <>
            {deleteMutation.isError && (
                <p className='px-5 pt-4 text-sm text-red-600'>
                    Could not delete the product. Please try again.
                </p>
            )}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-5 py-4">#</th>
                            <th className="px-5 py-4">Product</th>
                            <th className="px-5 py-4">Category</th>
                            <th className="px-5 py-4">Price</th>
                            <th className="px-5 py-4">Stock</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {pageProducts.map((product, index) => {
                            const stock = Number(product.stock || 0);
                            const name = product.name || product.title || "Unnamed product";

                            return (
                                <tr 
                                key={product.id}
                                    className='hover:bg-purple-50/40' >

                                        <td className="px-5 py-4 text-gray-500">
                                            {(currentPage - 1) * pageSize + index + 1}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={product.image || "/images/EduNest.png"} 
                                                    alt="" 
                                                    className="h-11 w-11 rounded-lg border object-cover"/>

                                                    <span className="font-semibold text-[#211B4D]">
                                                        {name}
                                                    </span>
                                            </div>
                                        </td>

                                        <td className='px-5 py-4'>
                                            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-[#3D348B]">
                                                {product.category || "Uncategorized"}
                                            </span>
                                        </td>

                                        <td className='px-5' py-4 text-medium>
                                            ₹{Number(product.price || 0) .toLocaleString("en-IN")}
                                        </td>

                                        <td className='px-5 py-4'>{stock}</td>

                                        <td>
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                stock === 0
                                                ? "bg-red-100 text-red-700"
                                                : stock <= 5
                                                ? "bg-amber-100 text-700"
                                                : "bg-emerald-100 text-emerald-700"
                                            }`}>
                                                {stock === 0
                                                ? "Out of Stock"
                                                : stock <= 5
                                                ?  "Low Stock"
                                                : "In Stock"}
                                            </span>
                                        </td>

                                        <td className='px-5 py-4'>
                                            <div className="flex justify-center gap-2">

                                                <button title='Edit Product'
                                                        onClick={() => openEditModal(product)}
                                                        className="rounded-lg bg-[#3D348B] p-2 text-white hover:bg-[#211B4D]">
                                                    <Pencil size={16} />
                                                </button>

                                                <button title='Delete Product'
                                                        disabled={deleteMutation.isPending}
                                                        onClick={() => handleDelete(product)}
                                                        className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600 disabled:opacity-50">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>

                                </tr>
                            )
                        })}

                        {pageProducts.length === 0 && (
                            <tr>
                                <td colSpan={7}
                                    className="px-5 py-12 text-center text-gray-500">
                                   No Products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
{/* Pagination */}            
            <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                    Showing{" "}
                    {filteredProducts.length === 0
                    ? 0
                    :(currentPage - 1) * pageSize + 1}
                    {" "}to{" "}
                    {Math.min(currentPage * pageSize, filteredProducts.length)}
                    {" "} of {filteredProducts.length} Products
                </p>

                <div className="flex items-center gap-2">
                    <button
                            disabled={currentPage === 1}
                            onClick={() => setPage ((p) => p-1 )}
                            className="rounded-lg border px-3 py-2 disabled:opacity-40">
                        Previous
                    </button>

                    <span className="rounded-lg bg-[#3D348B] px-4 py-2 text-white">
                        {currentPage} / {totalPages}
                    </span>

                    <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setPage ((p) => p + 1)}
                            className='rounded-lg border px-3 py-2 disabled:opacity-40'>
                        Next
                    </button>
                </div>
            </div>
            </>
        )}
      </div>


{/* Add/Edit modal  */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4'>
            <div className='my-auto w-full max-xl rounded-2xl bg-white shadow-xl'>
                <div className='flex items-center justify-between border-b p-5'>
                    <div>
                        <h3 className='text-xl font-bold text-[#211B4D]'>
                            {editingProduct? "Edit Product" : "Add New Product"}
                        </h3>
                        <p className='mt-1 text-sm text-gray-500'>
                            Enter the product details below.
                        </p>
                    </div>

                    <button 
                            onClick={closeModal}
                            className='rounded-lg p-2 hover:bg-gray-200'
                            aria-label="closeModal">

                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}
                        className='space-y-4 p-5'>
                    <div>
                        <label className='mb-1 block text-sm font-medium'>
                            Product Name *
                        </label>
                        <input 
                              required
                              value={form.name}
                              onChange={(e) => 
                              setForm({...form, name: e.target.value})
                              } 
                              className='w-full rounded-xl border p-3 outline-none focus:border-[#3D348B]'/>
                    </div>

                    <div className='grid gap-4 sm:grid-cols-2'>
                        <div>
                            <label className='mb-1 block text-sm font-medium'>
                                Category
                            </label>
                            <input 
                                    required
                                    value={form.category}
                                    onChange={(e) => 
                                        setForm({...form, category: e.target.value})
                                    }
                                    className='w-full rounded-xl border p-3 outline-none focus:border-[#3D348B]'/>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Price (₹)
                            </label>
                            <input 
                                    required
                                    type="number"
                                    min="0"
                                    value={form.price}
                                    onChange={(e) => 
                                        setForm({...form, price: e.target.value})
                                    }
                                    className='w-full rounded-xl border p-3 outline-none focus:border-[#3D348B]'/>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Stock
                            </label>
                            <input type="number"
                                    required
                                    min="0" 
                                    step='1'
                                    value={form.stock}
                                    onChange={(e) => 
                                        setForm({...form, stock: e.target.value})
                                    }
                                    className="w-full rounded-xl border p-3 outline-none focus:border-[#3D348B]"/>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Image URL
                            </label>
                            <input 
                                    
                                    required
                                    value={form.image}
                                    onChange={(e) => 
                                        setForm({...form, image: e.target.value})
                                    }
                                    className="w-full rounded-xl border p-3 outline-none focus:border-[#3D348B]"/>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Description
                        </label>
                        <textarea 
                            rows={3}
                            value={form.description}
                            onClick={(e) => 
                                setForm({...form, description: e.target.value})
                            }
                            className="w-full rounded-xl border p-3 outline-none focus:border-[#3D348B]"/>
                    </div>

                    {(formError || addMutation.isError || editMutation.isError) && (
                        <p className="text-sm text-red-600">
                            {formError ||
                            addMutation.error?.message || 
                            editMutation.error?.message ||
                            "Could not save the product."}
                        </p>
                    )}

                    <div  className="flex justify-end gap-3 border-t pt-4">
                        <button 
                                type='button'
                                onClick={closeModal}
                                className="rounded-xl border px-5 py-3 text-gray-600 hover:bg-gray-50">
                            cancel
                        </button>
                        <button 
                                type='submit'
                                disabled={saving}
                                className="rounded-xl bg-[#3D348B] px-5 py-3 font-semibold text-white hover:bg-[#211B4D] disabled:opacity-50">
                            {saving
                                ?"Saning..."
                                :editingProduct
                                ?"Save Changes"
                                :"Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </section>
    
  )
}
