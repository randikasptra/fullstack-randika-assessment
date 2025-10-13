import axios from 'axios';

const API_URL = '/api/user/payment';

const paymentService = {
    // Get Midtrans Snap Token
    getSnapToken: async (orderId) => {
        try {
            const response = await axios.get(`${API_URL}/${orderId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default paymentService;
