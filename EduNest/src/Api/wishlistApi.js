import axios from "axios";

const API = "http://localhost:3000/wishlists";

export const getWishlists = async () => {
    const res = await axios.get(API);
    return res.data
};

export const addToWishlist = async (product) => {
    const productId = product.productId ?? product.id;
    const res = await axios.get(API,{
        params: {productId},
    });

    if(res.data.length > 0){
        return res.data[0]
    }
    
    const newItem = await axios.post(API, {
        productId,
        name: product.name,
        image: product.image,
        category: product.category,
        price: product.price,
    });
    return newItem.data;
};


export const deleteWishlist = async (id) => {
    const res = await axios.delete(`${API}/${id}`) 
    return res.data
};