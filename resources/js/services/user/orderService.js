import axios from 'axios';

const API_URL = '/api/user/orders';

const orderService = {
    // Get all orders
    getOrders: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get order detail
    getOrderDetail: async (orderId) => {
        try {
            const response = await axios.get(`${API_URL}/${orderId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        try {
            const response = await axios.post(`${API_URL}/${orderId}/cancel`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default orderService;
