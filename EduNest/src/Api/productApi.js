import axios from "axios";

const API = "http://localhost:3000/products"
export const getProducts = async () => {
    const response = await axios.get(API);
    
    return response.data
}

//for Admin Side
export const addProduct = async (product) => {
    const response = await axios.post(API, product);

    return response.data;
};

export const updateProduct = async ({id, product}) => {
    const response = await axios.patch(`${API}/${id}`, product);

    return response.data;
};

export const deleteProduct = async(id) => {
     await axios.delete(`${API}/${id}`);

    return id;
}