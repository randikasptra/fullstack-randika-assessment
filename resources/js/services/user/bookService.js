import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

/**
 * Get auth token.
 * @returns {string|null} Token
 */
const getAuthToken = () => localStorage.getItem("auth_token");

/**
 * Get auth headers.
 * @returns {Object} Headers
 */
const getAuthHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
    'Accept': 'application/json',
});

/**
 * Book service for user book operations.
 */
const bookService = {
    /**
     * Get all books with filters/pagination.
     * @param {Object} params - { q, category, min_price, max_price, sort_by, page, per_page }
     * @returns {Promise<Object>} { data: [], meta: {} }
     * @throws {Error} On failure
     */
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

    /**
     * Get book by ID.
     * @param {number} bookId
     * @returns {Promise<Object>} Book data
     * @throws {Error} On failure
     */
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
};

export default bookService;
