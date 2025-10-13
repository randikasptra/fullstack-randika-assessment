// resources/js/services/admin/userService.js
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

/**
 * Get authorization token from localStorage
 */
const getAuthToken = () => {
    return localStorage.getItem("auth_token");
};

/**
 * Get authorization headers
 */
const getAuthHeaders = () => {
    return {
        Authorization: `Bearer ${getAuthToken()}`
    };
};

/**
 * Fetch all users
 */
export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/users`, {
            headers: getAuthHeaders()
        });
        // Handle both direct array or nested data structure
        const users = Array.isArray(response.data) ? response.data : response.data.data || [];
        return { success: true, data: users };
    } catch (error) {
        console.error("Error fetching users:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal memuat data user."
        };
    }
};

/**
 * Create a new user
 */
export const createUser = async (formData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/users`,
            formData,
            { headers: getAuthHeaders() }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error creating user:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal menambahkan user."
        };
    }
};

/**
 * Update an existing user
 */
export const updateUser = async (userId, formData) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/users/${userId}`,
            formData,
            { headers: getAuthHeaders() }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error updating user:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal memperbarui user."
        };
    }
};

/**
 * Delete a user
 */
export const deleteUser = async (userId) => {
    try {
        await axios.delete(`${API_BASE_URL}/api/users/${userId}`, {
            headers: getAuthHeaders()
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal menghapus user."
        };
    }
};
