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

const dashboardService = {
    // Get dashboard data
    getDashboardData: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/dashboard`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Dashboard error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Get order stats (optional, kalo butuh separate)
    getOrderStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/dashboard/order-stats`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Order stats error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Get spending analytics (optional)
    getSpendingAnalytics: async (months = 12) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/dashboard/spending-analytics?months=${months}`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Spending analytics error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },
};

export default dashboardService;
