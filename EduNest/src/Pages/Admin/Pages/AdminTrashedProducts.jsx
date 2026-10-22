import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../../Api/adminProductApi";
import {
  AlertTriangle,
  ArchiveRestore,
  PackageOpen,
  RefreshCw,
  RotateCcw,
  Search,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import Swal from "sweetalert2"

export default function AdminTrashedProducts() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [confirmAction, setConfirmAction] = useState(null);

  const PAGE_SIZE = 8;

  // Fetch products
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Only products marked as trashed
  const trashedProducts = useMemo(() => {
    return products.filter((product) => product.isTrashed === true);
  }, [products]);

  // Search products
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return trashedProducts.filter((product) => {
      const name = product.name || product.title || "";
      const category = product.category || "";

      return (
        name.toLowerCase().includes(term) ||
        category.toLowerCase().includes(term)
      );
    });
  }, [trashedProducts, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const pageProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Refresh
  const refreshProducts = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["products"],
    });
  };

  // Restore a trashed product
  const restoreMutation = useMutation({
    mutationFn: ({ id, product }) =>
      updateProduct({
        id,
        product: {
          ...product,
          isTrashed: false,
          deletedAt: null,
        },
      }),
    onSuccess: async () => {
        await queryClient.invalidateQueries({
            queryKey: ["products"],
        });

        Swal.fire({
            icon: "success",
            title: "Product Restored!",
            text: "The product is back in your active product list.",
            timer: 1800,
            showConfirmButton: false,
        });
    },
  });

  // Permanently delete a product
  const permanentDeleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),

    onSuccess: async () => {
        await queryClient.invalidateQueries({
            queryKey: ["products"],
        });

        Swal.fire({
            icon: "success",
            title: "Permanently Deleted!",
            text: "The product has been removed permanently.",
            timer: 1800,
            showConfirmButton: false,
        });
    },
  });



  const inventoryValue = trashedProducts.reduce(
    (total, product) =>
      total + Number(product.price || 0) * Number(product.stock || 0),
    0,
  );

  const isPending =
    restoreMutation.isPending || permanentDeleteMutation.isPending;

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const getProductName = (product) =>
    product.name || product.title || "Unnamed product";

  const handleRestore =async (product) => {
    const result = await Swal.fire({
        title: "Restore this product?",
        text: `${getProductName(product)} will return to your active products.`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Restore",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#059669",
        cancelButtonColor: "#6B7280",
        focusCancel: true,
    });

    if (result.isConfirmed) {
        restoreMutation.mutate({
            id: product.id,
            product,
        });
    }
  };

    const handlePermanentDelete = async (product) => {
       const result = await Swal.fire({
        title: "Delete permanently?",
        text: `This will permanently remove ${getProductName(product)}. This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete Forever",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#DC2626",
        cancelButtonColor: "#6B7280",
        focusCancel: true,
       });

       if (result.isConfirmed){
        permanentDeleteMutation.mutate(product.id);
       }
    }

 

//   const openConfirmation = (product, action) => {
//     selectedProduct(product);
//     setConfirmAction(action);
//   };

//   const closeConfirmation = () => {
//     if (isPending) return;

//     setSelectedProduct(null);
//     setConfirmAction(null);
//     permanentDeleteMutation.reset();
//   };

  const mutationError = restoreMutation.error || permanentDeleteMutation.error;

  return (
    <section className="min-h-screen space-y-6 bg-gray-50/70 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-red-50 p-3 text-red-600">
            <Trash size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#211B4D] sm:text-3xl">
              Trashed Products
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Restore deleted products or Permenently remove them
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl 
                                border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 
                                shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Trashed Products
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#211B4D]">
                {trashedProducts.length}
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                Products awaiting recovery or deletion
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <PackageOpen size={25} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Trashed Inventry Value
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#211B4D]">
                {formatPrice(inventoryValue)}
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                Price multiplied by remaining stock
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <ArchiveRestore size={25} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by product name or category..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 
                                      focus:border-[#3D348B] focus:bg-white focus:ring-4 focus:ring-[#3D348B]/10"
            />
          </div>

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm 
                                        text-gray-600 hover:bg-gray-50"
            >
              <X size={16} />
              Clear Search
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredProducts.length}
            </span>{" "}
            mathing products
          </p>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            Trash bin
          </span>
        </div>
      </div>

      {/* Product table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 p-16">
            <RefreshCw size={30} className="animate-spin text-[#3D348B]" />
            <p className="text-sm text-gray-500">Loading trashed products...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center">
            <AlertTriangle size={36} className="mx-auto text-red-500" />
            <h3 className="mt-3 font-semibold text-gray-800">
              Could not load products
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {error?.message || "Something went wrong."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-[#3D348B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#211B4D]"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {mutationError && (
              <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {mutationError.message ||
                  "The operation failed. Please try again."}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">#</th>
                    <th className="px-5 py-4 font-semibold">Product</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Price</th>
                    <th className="px-5 py-4 font-semibold">Stock</th>
                    <th className="px-5 py-4 font-semibold">Deleted On</th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Actions{" "}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pageProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-purple-50/30"
                    >
                      <td className="px-5 py-4 text-gray-400">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || "/image/EduNest.png"}
                            alt={getProductName(product)}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/image/EduNest.png";
                            }}
                            className="h-12 w-12 rounded-xl border border-gray-100 bg-gray-50 object-cover"
                          />

                          <div className="max-w-[230px]">
                            <p className="truncate font-semibold text-[#211B4D]">
                              {getProductName(product)}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-[#3D348B]">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-800">
                        {formatPrice(product.price)}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {Number(product.stock || 0)}
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {product.deletedAt
                          ? new Date(product.deletedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "_"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            title="Restore Product"
                            onClick={() => handleRestore (product, "restore")}
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 
                                                            px-3 py-2 font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                          >
                            <RotateCcw size={15} />
                            <span>Restore</span>
                          </button>

                          <button
                            type="button"
                            title="Permanently delete product"
                            onClick={() => handlePermanentDelete(product, "delete")}
                            disabled={isPending}
                            className="rounded-lg bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {pageProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-16">
                        <div className="flex flex-col items-center text-center">
                          <div className="rounded-2xl bg-gray-100 p-4 text-gray-400">
                            <PackageOpen size={34} />
                          </div>
                          <h3 className="mt-4 font-semibold text-gray-800">
                            {search ? "No matching products" : "Trash is empty"}
                          </h3>
                          <p className="mt-1 max-w-sm text-sm text-gray-500">
                            {search
                              ? "Try another product name or category."
                              : "Deleted products will appear here so you can restore them or remove them permanently."}
                          </p>
                          {search && (
                            <button
                              type="button"
                              onClick={() => {
                                setSearch("");
                                setPage(1);
                              }}
                              className="mt-4 text-sm font-semibold text-[#3D348B] hover:underline"
                            >
                              Clear search
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                {filteredProducts.length === 0
                  ? 0
                  : (currentPage - 1) * PAGE_SIZE + 1}{" "}
                - {Math.min(currentPage * PAGE_SIZE, filteredProducts.length)}{" "}
                of {filteredProducts.length}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage((previous) => previous - 1)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm 
                                                font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prvious
                </button>
                <span className="rounded-lg bg-[#3D348B] px-4 py-2 text-sm font-semibold text-white">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((previous) => previous + 1)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirmation modal */}
      {/* {confirmAction  (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeConfirmation();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="trash-confirm-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
                confirmAction === "restore"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {confirmAction === "restore" ? (
                <ArchiveRestore size={27} />
              ) : (
                <AlertTriangle size={27} />
              )}
            </div>

            <h2
              id="trash-confirm-title"
              className="mt-4 text-center text-xl font-bold text-[#211B4D]"
            >
              {confirmAction === "restore"
                ? "Restore this product?"
                : "Permanently delete?"}
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-gray-500">
              {confirmAction === "restore"
                ? `${getProductName(selectedProduct)} will be moved back to your active product list.`
                : `This will permanently remove ${getProductName(selectedProduct)}. This action cannot be undone.`}
            </p>

            {mutationError && (
              <p className="mt-3 text-center text-sm text-red-600">
                {mutationError.message || "Operation failed."}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeConfirmation}
                disabled={isPending}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm 
                                            font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  confirmAction === "restore"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isPending
                  ? "Please wait..."
                  : confirmAction === "restore"
                    ? "Yes, Restore"
                    : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )} */}
    </section>
  );
}
