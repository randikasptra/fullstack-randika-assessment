import axios from 'axios';
import { API_BASE_URL } from '../../../config/api'; // Import ini kalo belum ada, atau ganti '/api' ke full URL

const getAuthToken = () => {
    return localStorage.getItem("auth_token");
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json', // Tambah ini buat JSON response
        'Content-Type': 'application/json',
    };
};

const checkoutService = {
    // Checkout from cart
    createOrderFromCart: async (shippingData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/user/checkout/create-order`, // Pastiin prefix /api kalo api.php punya Route::prefix('api')
                shippingData,
                { headers: getAuthHeaders() } // Tambah headers auth!
            );
            return response.data;
        } catch (error) {
            console.error('Checkout error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Buy now (direct checkout)
    buyNow: async (bookId, quantity, shippingData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/user/checkout/buy-now`,
                {
                    book_id: bookId,
                    quantity: quantity,
                    ...shippingData,
                },
                { headers: getAuthHeaders() } // Tambah headers auth!
            );
            return response.data;
        } catch (error) {
            console.error('Buy now error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },
};

export default checkoutService;
