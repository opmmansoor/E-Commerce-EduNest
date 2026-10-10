import axios from "axios";

const API ="http://localhost:3000/carts"
export const retCart = async () => {
    const response = await axios.get(API)
    return response.data
};

export const addCartItem = async (item) => {
    const response = await axios.post(API,item);
    return response.data
};

export const deleteCartItem = async (id) => {
    const response = await axios.delete(`${API}/${id}`)
    return response.data
};