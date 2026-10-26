import axios from "axios";

const API = "http://localhost:3000/products"
export const getProducts = async (user) => {
    const response = await axios.get(`${API}/${user.id}`,{

        isBlocked: !user.isBlocked,
    });
    
    return response.data
};
