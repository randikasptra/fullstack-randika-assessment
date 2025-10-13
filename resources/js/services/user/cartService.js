import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const getAuthToken = () => {
    return localStorage.getItem("auth_token");
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? {
        Authorization: `Bearer ${token}`
    } : {};
};

const cartService = {
    // Get cart items
    index: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/cart`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching cart:", error);
            throw error.response?.data || error;
        }
    },

    // Add item to cart
    addToCart: async (bookId, quantity = 1) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/user/cart/add`,
                { book_id: bookId, quantity },
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error adding to cart:", error);
            throw error.response?.data || error;
        }
    },

    // Update cart item
    update: async (cartItemId, quantity) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/user/cart/${cartItemId}`,
                { quantity },
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating cart:", error);
            throw error.response?.data || error;
        }
    },

    // Delete cart item
    destroy: async (cartItemId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/api/user/cart/${cartItemId}`,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting cart item:", error);
            throw error.response?.data || error;
        }
    },

    // Clear entire cart
    clear: async () => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/api/user/cart`,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error clearing cart:", error);
            throw error.response?.data || error;
        }
    }
};

export default cartService;
