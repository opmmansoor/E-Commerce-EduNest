import { createSlice } from "@reduxjs/toolkit"

const savedUser = localStorage.getItem("user");

const initialState = {
    user: savedUser ? JSON.parse(savedUser) : null
    // isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
};

const authSlice = createSlice({

    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload;
            // state.isLoggedIn = true;
        },

        logout: (state) => {
            state.user = null;
            // state.isLoggedIn = false;
            localStorage.removeItem("user");
            // localStorage.removeItem("isLoggedIn");
        },
    },
})

export const { setCredentials, logout }  = authSlice.actions;
export default authSlice.reducer;