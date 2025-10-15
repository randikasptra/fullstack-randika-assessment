// resources/js/services/user/orderService.js
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const getAuthToken = () => {
    return localStorage.getItem("auth_token");
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
    };
};

const API_URL = `${API_BASE_URL}/api/user/orders`;

const orderService = {
    // Get all orders
    getOrders: async () => {
        try {
            const response = await axios.get(API_URL, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Order error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Get order detail
    getOrderDetail: async (orderId) => {
        try {
            const response = await axios.get(`${API_URL}/${orderId}`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Order detail error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        try {
            const response = await axios.post(`${API_URL}/${orderId}/cancel`, {}, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Cancel order error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Delete order (for cancelled orders only)
    deleteOrder: async (orderId) => {
        try {
            const response = await axios.delete(`${API_URL}/${orderId}`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Delete order error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Confirm order (for shipped status only)
    confirmOrder: async (orderId) => {
        try {
            const response = await axios.post(`${API_URL}/${orderId}/confirm`, {}, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Confirm order error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },
};

export default orderService;
