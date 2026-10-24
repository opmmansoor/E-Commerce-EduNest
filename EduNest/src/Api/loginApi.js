import axios from "axios";

const API_URL = "http://localhost:3000/users";

export const loginUser = async ({ email, password }) => {
  const response = await axios.get( API_URL, {
    params: {
      email: email.trim(),
      password,
    },
  });

  if (response.data.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = response.data[0];

// Check whether the user is blocked
  if(user.isBlocked === true) {
    throw new Error( "Your account has been blocked. Please contact the administrator." )

  }

  return user;
};