import axios from "axios";

const API_URL = "http://localhost:3000"

// Fetch all orders
export const getOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
};

// Fetch users to display customer information
export const getOrderCustomers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

