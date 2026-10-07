import axios from "axios";

const API_URL = "http://localhost:3000/users";
export const registerUser = async (userData) => {
    const response = await axios.get( `${API_URL}?email=${userData.email}`)
    
    if(response.data.length > 0) {
        throw new Error("Email already exists")
    }

    //create new user
    const newUser = {
        firstName: userData.firstName,
        secondName: userData.secondName,
        email: userData.email,
        password: userData.password,
    };

    // Save user to JSON Server
    const result = await axios.post(API_URL, newUser);

    return result.data;
}