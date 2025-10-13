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
};

export default paymentService;
