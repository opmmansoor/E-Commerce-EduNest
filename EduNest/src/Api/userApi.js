import axios from "axios";

const API = "http://localhost:3000/users";

export const getUserById = async(userId) => {
    const response = await axios.get(
        `${API}/${userId}`
    );
    return response.data;
}