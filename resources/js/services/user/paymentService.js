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

const paymentService = {
    getSnapToken: async (orderId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/user/payment/${orderId}`,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Payment error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Tambahkan method untuk update payment status
    updatePaymentStatus: async (orderId, paymentData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/user/payment/${orderId}/update-status`,
                paymentData,
                { headers: getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Update status error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },
};

export default paymentService;
