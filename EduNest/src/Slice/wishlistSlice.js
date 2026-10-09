import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState:  {
        wishlist: [],
    },

    reducers: {
        addToWishlist: (state, action) => {
            const exists = state.wishlist.some(
                (item) => item.id === action.payload.id
            );

            if(!exists) {
                state.wishlist.push(action.payload);
            }
        },

        removeFromWishlist: (state, action) => {
            state.wishlist = state.wishlist.filter(
                (item) => item.id !== action.payload
            );
        },
    },

})

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;