import axios from 'axios';

const API_URL = '/api/user/checkout';

const checkoutService = {
    // Checkout from cart
    createOrderFromCart: async (shippingData) => {
        try {
            const response = await axios.post(`${API_URL}/create-order`, shippingData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Buy now (direct checkout)
    buyNow: async (bookId, quantity, shippingData) => {
        try {
            const response = await axios.post(`${API_URL}/buy-now`, {
                book_id: bookId,
                quantity: quantity,
                ...shippingData,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default checkoutService;
