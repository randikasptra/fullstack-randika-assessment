import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

/**
 * Get auth token.
 * @returns {string|null} Token
 */
const getAuthToken = () => localStorage.getItem("auth_token");

/**
 * Get auth headers.
 * @returns {Object} Headers
 */
const getAuthHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
});

/**
 * Cart service for user cart operations.
 */
const cartService = {
    /**
     * Get cart items and total.
     * @returns {Promise<Object>} Response
     * @throws {Error} On failure
     */
    index: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/cart`, {
                headers: getAuthHeaders(),
                timeout: 5000,
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                throw new Error('Session expired');
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch cart');
        }
    },

    /**
     * Add book to cart.
     * @param {number} bookId - Book ID
     * @param {number} [quantity=1] - Quantity
     * @returns {Promise<Object>} Response
     * @throws {Error} On failure
     */
    addToCart: async (bookId, quantity = 1) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/user/cart/add`, { book_id: bookId, quantity }, {
                headers: getAuthHeaders(),
                timeout: 5000,
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 422) {
                throw new Error(error.response.data.message || 'Invalid input');
            }
            throw new Error(error.response?.data?.message || 'Failed to add to cart');
        }
    },

    /**
     * Update cart item quantity.
     * @param {number} cartItemId - Cart item ID
     * @param {number} quantity - New quantity
     * @returns {Promise<Object>} Response
     * @throws {Error} On failure
     */
    update: async (cartItemId, quantity) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/user/cart/${cartItemId}`, { quantity }, {
                headers: getAuthHeaders(),
                timeout: 5000,
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update cart');
        }
    },

    /**
     * Delete cart item.
     * @param {number} cartItemId - Cart item ID
     * @returns {Promise<Object>} Response
     * @throws {Error} On failure
     */
    destroy: async (cartItemId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/user/cart/${cartItemId}`, {
                headers: getAuthHeaders(),
                timeout: 5000,
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to remove item');
        }
    },

    /**
     * Clear cart.
     * @returns {Promise<Object>} Response
     * @throws {Error} On failure
     */
    clear: async () => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/user/cart`, {
                headers: getAuthHeaders(),
                timeout: 5000,
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to clear cart');
        }
    },
};

export default cartService;
