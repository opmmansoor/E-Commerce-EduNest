import axios from "axios";

const API = "http://localhost:3000/orders";

export const createOrder = async (orderData) => {
    const res = await axios.post(API,orderData);
    return res.data;
};

//get all orders
    export const getOrders = async () => {
        const res = await axios.get(API);
        return res.data;
    };

// Get a single order by ID
    export const getUserOrder = async (userId) => {
        const res = await axios.get(API,{
            params: { userId },
        })
        return res.data;
    }    