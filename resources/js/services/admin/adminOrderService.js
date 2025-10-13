import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const getAuthToken = () => localStorage.getItem("auth_token");

const getAuthHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
    'Accept': 'application/json',
});

const adminOrderService = {
    getOrders: async (params = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/orders`, {
                headers: getAuthHeaders(),
                params,
            });
            return response.data;
        } catch (error) {
            console.error('Admin orders error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    getOrderDetail: async (orderId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Order detail error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    updateStatus: async (orderId, status) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, { status }, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Update status error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    cancelOrder: async (orderId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/admin/orders/${orderId}/cancel`, {}, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Cancel order error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    getStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/orders/stats`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Order stats error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },
};

export default adminOrderService;
