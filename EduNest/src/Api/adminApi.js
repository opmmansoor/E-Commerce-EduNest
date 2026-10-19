import axios from "axios";

const Admin_API = "http://localhost:3000/admins";

export const loginAdmin = async ({email, password}) => {
    const response = await axios.get(`${Admin_API}`, {
        params: {
            email,
            password,
            role: "admin",
        },
    })
    const admins = response.data;

    if(admins.length === 0) {
        throw new Error("Invalid admin email or password.")
    };

    const { id, name, email: adminEmail, role } = admins[0];
    return {
        id,
        email: adminEmail,
        name,
        role,
    };
};


// GET USERS AND ORDERS

const API_URL = "http://localhost:3000";

export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users`)
    return response.data
};


// Fetch all orders
export const getOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
};