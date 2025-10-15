import axios from 'axios';
<<<<<<< HEAD

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
=======
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
import { API_BASE_URL } from '../../../config/api';

const getAuthToken = () => {
    return localStorage.getItem("auth_token");
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
<<<<<<< HEAD
        'Content-Type': 'application/json',
=======
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
    };
};

const adminDashboardService = {
<<<<<<< HEAD
    /**
     * Get admin dashboard data
     * Endpoint: GET /api/admin/dashboard
     */
    getDashboardData: async () => {
        try {
            console.log('🔄 Fetching dashboard data...');
            console.log('API URL:', `${API_BASE_URL}/api/admin/dashboard`);
            console.log('Token:', getAuthToken() ? '✅ Available' : '❌ Missing');

            const response = await axios.get(
                `${API_BASE_URL}/api/admin/dashboard`,
                { headers: getAuthHeaders() }
            );

            console.log('✅ Dashboard Response:', response);
            console.log('Response Data:', response.data);

            return response.data;

        } catch (error) {
            console.error('❌ Admin Dashboard error:', error);
            console.error('Error Response:', error.response);
            console.error('Error Status:', error.response?.status);
            console.error('Error Data:', error.response?.data);

            throw {
                message: error.response?.data?.message || error.message || 'Failed to load dashboard',
                status: error.response?.status,
                details: error.response?.data,
            };
=======
    // Get admin dashboard data
    getDashboardData: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Admin Dashboard error:', error.response?.data || error);
            throw error.response?.data || error;
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
        }
    },
};

export default adminDashboardService;
