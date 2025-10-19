import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

/**
 * Get auth token from localStorage.
 * @returns {string|null} Token
 */
const getAuthToken = () => localStorage.getItem("auth_token");

/**
 * Get auth headers for API requests.
 * @returns {Object} Headers
 */
const getAuthHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
});

/**
 * Dashboard service for user analytics.
 */
const dashboardService = {
    /**
     * Get dashboard data with retry logic.
     * @returns {Promise<Object>} Response data
     * @throws {Error} If all retries fail
     */
    getDashboardData: async (retries = 2) => {
        for (let i = 0; i <= retries; i++) {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/user/dashboard`, {
                    headers: getAuthHeaders(),
                    timeout: 5000, // 5s timeout for performance
                });
                return response.data;
            } catch (error) {
                if (i === retries || error.response?.status === 401) {
                    throw new Error(error.response?.data?.message || `Request failed after ${retries} retries`);
                }
                // Wait 1s before retry
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    },
};

export default dashboardService;
