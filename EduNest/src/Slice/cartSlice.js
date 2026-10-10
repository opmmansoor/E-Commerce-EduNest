import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name:"cart",
    initialState: {
        cart: []
    },
    reducers: {
        addToCart : (state,action) => {
            const product = action.payload;

            const existingItem = state.cart.find(
                (item) => item.id === product.id
            );

            if(existingItem){
                existingItem.quantity += 1;
            }else{
                state.cart.push({
                    ...product,
                    quantity: 1,
                })
            }
        },

        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(
                (item) => item.id !== action.payload
            )
        },

        increaseQuantity: (state, action) => {
            const product = state.cart.find(
                (item) => item.id === action.payload
            );

            if(product){
                product.quantity += 1;
            }
        },

        decreaseQuantity: (state,action) => {
            const product = state.cart.find(
                (item) => item.id === action.payload
            );

            if(product && product.quantity > 1){
                product.quantity -= 1;
            }
        },

        clearCart: (state) => {
            state.cart = []
        },
    },
})

export const {addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart} = cartSlice.actions;
export default cartSlice.reducer;