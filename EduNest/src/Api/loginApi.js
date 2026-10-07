import axios from "axios";

const API_URL = "http://localhost:3000/users";

export const loginUser = async ({ email, password }) => {
  const response = await axios.get( `${API_URL}?email=${email}&password=${password}`);

  if (response.data.length === 0) {
    throw new Error("Invalid email or password");
  }

  return response.data[0];
};