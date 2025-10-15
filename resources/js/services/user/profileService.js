import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const getAuthToken = () => localStorage.getItem("auth_token");

const getAuthHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
});

const profileService = {
    // Get profile
    getProfile: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/profile`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Profile error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Update profile
    updateProfile: async (profileData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/user/profile`, profileData, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Update profile error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Change password
    changePassword: async (passwordData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/user/change-password`, passwordData, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Change password error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },
};

export default profileService;
