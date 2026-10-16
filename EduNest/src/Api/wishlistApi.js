import axios from "axios";

const API = "http://localhost:3000/wishlists";

export const getWishlists = async (userId) => {
    if (!userId) return [];

    const response = await axios.get(API, {
         params : {
            userId: String(userId) 
        },
    });
    return response.data
};

export const addToWishlist = async ({product, userId}) => {
    if(!userId){
        throw new Error("Please login first");
    }
    const productId = String(product.id);

    const response = await axios.get(API, {
        params: {
            userId: String(userId),
            productId,
        },
    });

    if (response.data.length > 0) {
        return response.data[0];
    }
    
    const newItem = await axios.post(API, {
        userId: String(userId),
        productId,
        name: product.name,
        image: product.image,
        category: product.category,
        price: product.price,
    });

    return newItem.data;
};


export const deleteWishlist = async ({ id, userId }) => {
    if (!userId) {
        throw new Error("Please login first");
    }

    const response = await axios.get(API, {
        params: {
            id,
            userId: String(userId),
        },
    });
    
    if (response.data.length === 0) {
    throw new Error("Wishlist item not found");
  }

    const item = response.data[0];

    const deletedItem = await axios.delete(
        `${API}/${item.id}`
    );

    return deletedItem.data;
};