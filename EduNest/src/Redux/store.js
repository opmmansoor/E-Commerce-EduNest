import { configureStore } from "@reduxjs/toolkit";
import cartReducer from '../Slice/cartSlice'
import wishlistReducer from '../Slice/wishlistSlice'
import authReducer from '../Slice/authSlice'

export const store = configureStore({
    reducer: {
        auth:authReducer,
        cart:cartReducer,
        wishlist: wishlistReducer,
    }
})