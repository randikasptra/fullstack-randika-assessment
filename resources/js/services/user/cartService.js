import axios from 'axios';

const API_URL = '/api/user/cart';

const cartService = {
    // Get all cart items
    getCart: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Add item to cart
    addToCart: async (bookId, quantity = 1) => {
        try {
            const response = await axios.post(`${API_URL}/add`, {
                book_id: bookId,
                quantity: quantity,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update cart item quantity
    updateCart: async (cartId, quantity) => {
        try {
            const response = await axios.put(`${API_URL}/${cartId}`, {
                quantity: quantity,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Remove item from cart
    removeFromCart: async (cartId) => {
        try {
            const response = await axios.delete(`${API_URL}/${cartId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Clear all cart
    clearCart: async () => {
        try {
            const response = await axios.delete(API_URL);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default cartService;
