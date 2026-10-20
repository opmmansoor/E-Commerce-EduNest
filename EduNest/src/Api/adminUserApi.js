import axios from "axios";

const API_URL = "http://localhost:3000/users";

// fetch all Users
export const getUsers = async () => {
    const response = await axios.get(API_URL);

    return response.data;
};

//Block or Unblock a User
export const updateUserStatus = async (user) => {
    const response = await axios.patch( `${API_URL}/${user.id}`,
        {
            isBlocked: !user.isBlocked,
        }
    );
    return response.data;
}