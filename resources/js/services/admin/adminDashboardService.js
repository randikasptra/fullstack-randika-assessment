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
    'Content-Type': 'application/json',
});

/**
 * Admin dashboard service.
 */
const adminDashboardService = {
    /**
     * Get dashboard data with retry.
     * @param {number} [retries=3] - Retry count
     * @returns {Promise<Object>} Response data
     * @throws {Error} On failure after retries
     */
    getDashboardData: async (retries = 3) => {
        for (let i = 0; i <= retries; i++) {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard`, {
                    headers: getAuthHeaders(),
                    timeout: 10000, // 10s for heavy queries
                });
                return response.data;
            } catch (error) {
                console.error('❌ Admin Dashboard error:', error); // Keep console
                console.error('Error Response:', error.response);
                console.error('Error Status:', error.response?.status);
                console.error('Error Data:', error.response?.data);

                if (i === retries || error.response?.status === 401 || error.response?.status === 500) {
                    if (error.response?.status === 401) {
                        localStorage.removeItem('auth_token');
                        throw new Error('Session expired');
                    }
                    throw {
                        message: error.response?.data?.message || error.message || 'Failed to load dashboard',
                        status: error.response?.status,
                        details: error.response?.data,
                    };
                }
                // Exponential backoff: wait 1s, 2s, 4s
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
    },
};

export default adminDashboardService;
