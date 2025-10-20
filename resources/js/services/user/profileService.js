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
 * Profile service for user profile operations.
 */
const profileService = {
    /**
     * Get user profile.
     * @returns {Promise<Object>} Response data
     * @throws {Error} On failure
     */
    getProfile: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
                headers: getAuthHeaders(),
                timeout: 5000,
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                throw new Error('Session expired');
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
        }
    },

    /**
     * Update user profile.
     * @param {Object} profileData - Profile fields
     * @returns {Promise<Object>} Response data
     * @throws {Error} On failure
     */
    updateProfile: async (profileData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/user/profile`, profileData, {
                headers: getAuthHeaders(),
                timeout: 5000,
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 422) {
                throw { errors: error.response.data.message }; // Parse validation errors
            }
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    },

    /**
     * Change user password.
     * @param {Object} passwordData - { new_password, new_password_confirmation }
     * @returns {Promise<Object>} Response data
     * @throws {Error} On failure
     */
    changePassword: async (passwordData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/user/change-password`, passwordData, {
                headers: getAuthHeaders(),
                timeout: 5000,
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 422) {
                throw { errors: error.response.data.message };
            }
            throw new Error(error.response?.data?.message || 'Failed to change password');
        }
    },
};

export default profileService;
