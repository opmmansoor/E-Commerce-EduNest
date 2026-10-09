import { configureStore } from "@reduxjs/toolkit";
import cartReducer from '../Slice/cartSlice'
import wishlistReducer from '../Slice/wishlistSlice'

export const store = configureStore({
    reducer: {
        cart:cartReducer,
        wishlist: wishlistReducer,
    }
})