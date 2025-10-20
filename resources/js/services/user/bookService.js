// resources/js/services/user/bookService.js
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import echo from '../../config/echo';

const getAuthToken = () => localStorage.getItem("auth_token");

const getAuthHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
    'Accept': 'application/json',
});

const bookService = {
    getAllBooks: async (params = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/books`, {
                headers: getAuthHeaders(),
                params: { ...params, page: params.page || 1, per_page: params.per_page || 20 },
                timeout: 10000,
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                throw new Error('Session expired');
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch books');
        }
    },

    getBookById: async (bookId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/books/${bookId}`, {
                headers: getAuthHeaders(),
                timeout: 5000,
            });
            return response.data.data || response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Book not found');
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch book');
        }
    },

    /**
     * Subscribe to ALL products stock updates (Global Channel)
     * @param {Function} callback - (updatedBook) => {}
     * @returns {Object} Echo channel
     */
    subscribeToStockUpdates: (callback) => {
        console.log('🔔 Subscribing to global products channel');

        const channel = echo.channel('products');

        channel.listen('.stock.updated', (data) => {
            console.log('📦 Stock updated:', data);
            if (typeof callback === 'function') {
                callback(data);
            }
        });

        return channel;
    },

    /**
     * Unsubscribe from stock updates
     */
    unsubscribeFromStockUpdates: () => {
        echo.leaveChannel('products');
        console.log('👋 Unsubscribed from products channel');
    },
};

export default bookService;
