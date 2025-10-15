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

const adminDashboardService = {
    // Get admin dashboard data
    getDashboardData: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Admin Dashboard error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },
};

export default adminDashboardService;
