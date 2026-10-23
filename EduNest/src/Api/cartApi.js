import axios from "axios";

const API = "http://localhost:3000/carts";

export const getCart = async (userId) => {
  if (!userId) return [];

  const response = await axios.get(API, {
    params: { userId: String(userId) },
  });
  return response.data;
};

// Add product to cart.
// If it already exists for this user, increase quantity.

export const addCartItem = async ({
  userId,
  productId,
  name,
  price,
  image,
  quantity = 1,
}) => {
  if (!userId) {
    throw new Error("Please login to add products to your cart.");
  }
   

  const normalizedUserId = userId;
  const normalizedProductId = productId;

  // Get existing cart items
  const response = await axios.get(API, {
    params: {
      userId: normalizedUserId,
      productId: normalizedProductId,
    },
  });

  const existingItem = response.data[0];
  // Check whether this product already exists
   
  if (existingItem) {
    console.log('exist');

    const updated = await axios.patch(`${API}/${existingItem.id}`, {
      quantity: Number(existingItem.quantity || 0) + Number(quantity),
    });
    return updated.data;
  }

  // Create a new row only when the product isn't in the cart
  const newItem = {
    userId: normalizedUserId,
    productId: normalizedProductId,
    name,
    price: Number(price),
    image: image || "",
    quantity: Number(quantity),
  };

  const created = await axios.post(API, newItem);
  return created.data;
};

// Update quantity
export const updateCartItem = async ({ id, userId, quantity }) => {
  if (!userId) {
    throw new Error("Please Login first");
  }
  const response = await axios.get(API, {
    params: {
      id: String(id),
      userId: String(userId),
    },
  });

  const item = response.data[0];
  if (!item) {
    throw new Error("Cart item not found for this user.");
  }

  if (Number(quantity) <= 0) {
    return deleteCartItem({ id: item.id, userId });
  }

  const updated = await axios.patch(`${API}/${item.id}`, {
    quantity: Number(quantity),
  });

  return updated.data;
};

export const deleteCartItem = async ({ id, userId }) => {
  if (!userId) {
    throw new Error("Please Login first");
  }

  const response = await axios.get(API, {
    params: {
      id: String(id),
      userId: String(userId),
    },
  });

  const item = response.data[0];

  if (!item) {
    throw new Error("Cart item not found for this user.");
  }
  await axios.delete(`${API}/${item.id}`);
  return item;
};
