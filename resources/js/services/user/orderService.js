import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

/**
 * Get auth token from localStorage.
 * @returns {string|null} Token
 */
const getAuthToken = () => localStorage.getItem("auth_token");

/**
 * Get auth headers for API requests.
 * @returns {Object} Headers
 */
const getAuthHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
});

const API_URL = `${API_BASE_URL}/api/user/orders`;

/**
 * Order service for user order management.
 */
const orderService = {
    /**
     * Get all orders with pagination.
     * @param {Object} params - Query params (page, per_page)
     * @returns {Promise<Object>} Response data
     * @throws {Error} If request fails
     */
    getOrders: async (params = {}) => {
        try {
            const response = await axios.get(API_URL, {
                headers: getAuthHeaders(),
                params,
                timeout: 10000, // Performance: 10s timeout
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token'); // Security: Logout on auth fail
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch orders');
        }
    },

    /**
     * Get order detail.
     * @param {number} orderId - Order ID
     * @returns {Promise<Object>} Response data
     * @throws {Error} If request fails
     */
    getOrderDetail: async (orderId) => {
        try {
            const response = await axios.get(`${API_URL}/${orderId}`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Order not found');
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch order detail');
        }
    },

    /**
     * Cancel order.
     * @param {number} orderId - Order ID
     * @returns {Promise<Object>} Response data
     * @throws {Error} If request fails
     */
    cancelOrder: async (orderId) => {
        try {
            const response = await axios.post(`${API_URL}/${orderId}/cancel`, {}, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            if (error.response?.status === 422) {
                throw new Error(error.response.data.message || 'Cannot cancel this order');
            }
            throw new Error(error.response?.data?.message || 'Failed to cancel order');
        }
    },

    /**
     * Delete order.
     * @param {number} orderId - Order ID
     * @returns {Promise<Object>} Response data
     * @throws {Error} If request fails
     */
    deleteOrder: async (orderId) => {
        try {
            const response = await axios.delete(`${API_URL}/${orderId}`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete order');
        }
    },

    /**
     * Confirm order.
     * @param {number} orderId - Order ID
     * @returns {Promise<Object>} Response data
     * @throws {Error} If request fails
     */
    confirmOrder: async (orderId) => {
        try {
            const response = await axios.post(`${API_URL}/${orderId}/confirm`, {}, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            if (error.response?.status === 422) {
                throw new Error(error.response.data.message || 'Cannot confirm this order');
            }
            throw new Error(error.response?.data?.message || 'Failed to confirm order');
        }
    },
};

export default orderService;
