import axios from "axios"

const API = "http://localhost:3000/products"

export const getProducts = async () => {
    const response = await axios.get(API);   
    return response.data
}

export const addProduct = async (product) => {
    const response = await axios.post(API, {
        ...product,
        isTrashed: false,
        deletedAt: null,
    });
    return response.data;
};

export const updateProduct = async ({id, product}) => {
    const response = await axios.patch(`${API}/${id}`, product);
    return response.data;
};

// Soft delete: move product to trash
export const softDeleteProduct = async (product) => {
    const response = await axios.patch(`${API}/${product.id}`, {
        isTrashed: true,
        deletedAt: new Date().toISOString(),
    });
    return response.data;
}

// Restore product from Trash
export const restoreProduct = async (id) => {
  const response = await axios.patch(`${API}/${id}`, {
    isTrashed: false,
    deletedAt: null,
  });

  return response.data;
};

// Permanent delete: remove product completely
export const deleteProduct = async (id) => {
  await axios.delete(`${API}/${id}`);
  return id;
};

