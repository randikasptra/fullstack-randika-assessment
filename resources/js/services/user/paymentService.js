// resources/js/services/user/paymentService.js
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const getAuthToken = () => localStorage.getItem("auth_token");

const getAuthHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
    'Accept': 'application/json',
});

const paymentService = {
    getSnapToken: async (orderId) => {
        try {
            console.log('Calling getSnapToken for orderId:', orderId, 'with token:', getAuthToken()?.substring(0, 10) + '...'); // Debug token
            const response = await axios.get(`${API_BASE_URL}/api/user/payment/${orderId}`, { headers: getAuthHeaders() });
            console.log('Raw Payment Response:', response); // Debug full axios response
            console.log('Payment Response Data:', response.data); // Debug data
            if (Array.isArray(response.data) || !response.data.success) {
                throw new Error('Unexpected response: Expected {success, snap_token, order}, got ' + JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('Payment error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error.response?.data || error;
        }
    },

    // ✅ FUNGSI YANG HILANG - Tambahkan ini
    updatePaymentStatus: async (orderId, paymentData) => {
        try {
            console.log('Updating payment status for orderId:', orderId);
            console.log('Payment data:', paymentData);

            const response = await axios.post(
                `${API_BASE_URL}/api/user/payment/${orderId}/update-status`,
                paymentData,
                { headers: getAuthHeaders() }
            );

            console.log('Update status response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating payment status:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw error.response?.data || error;
        }
    },

    // ✅ Bonus: Get order history
    getOrderHistory: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/user/orders`,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching order history:', error);
            throw error.response?.data || error;
        }
    },

    // ✅ Bonus: Get single order detail
    getOrderDetail: async (orderId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/user/orders/${orderId}`,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching order detail:', error);
            throw error.response?.data || error;
        }
    },
};

export default paymentService;
