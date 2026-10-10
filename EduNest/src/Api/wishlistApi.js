import axios from "axios";

const API = "http://localhost:3000/wishlists";

export const getWishlist = async () => {
    const res = await axios.get(API);
    return res.data
};

export const addToWishlist = async (item) => {
    const res = await axios.post(API,item);
    return res.data
};


export const deleteWishlist = async (id) => {
    const res = await axios.delete(`${API}/${id}`) 
    return res.data
};