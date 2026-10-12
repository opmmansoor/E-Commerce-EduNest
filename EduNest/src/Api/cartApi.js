import axios from "axios";

const API ="http://localhost:3000/carts"

export const getCart = async () => {
    const response = await axios.get(API)
    return response.data
};

export const addCartItem = async (item) => {
// Get existing cart items
    const response = await axios.get(API);
    const cartItems = response.data

// Check whether this product already exists
    const existingItem = cartItems.find(
        (cartItem) => String(cartItem.productId) === String(item.productId)
    );
    
    if(existingItem){
        const updateResponse = await axios.patch(
            `${API}/${existingItem.id}`,
            { quantity: Number(existingItem.quantity || 1) + 1,
            }
        );
        return updateResponse.data
    }
// Create a new row only when the product isn't in the cart
    const newResponse = await axios.post(API, {
        ...item,
        quantity:  1,
    });
    return newResponse.data
};

export const deleteCartItem = async (id) => {
    const response = await axios.delete(`${API}/${id}`)
    return response.data
};