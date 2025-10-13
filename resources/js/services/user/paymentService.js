import axios from 'axios';
import { API_BASE_URL } from '../../../config/api'; // Import ini kalo belum ada

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
            const response = await axios.get(`${API_BASE_URL}/api/user/payment/${orderId}`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Payment error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },
};

export default paymentService;
