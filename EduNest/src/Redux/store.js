import { configureStore } from "@reduxjs/toolkit";
import cartReducer from '../Slice/cartSlice'

export const store = configureStore({
    reducer: {
        cart:cartReducer
    }
})