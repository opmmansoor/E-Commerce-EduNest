import axios from "axios";

const API = "http://localhost:3000/products"
export const getProducts = async () => {
    const response = await axios.get(API);
    
    return response.data;
};
