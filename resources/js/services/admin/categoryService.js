// resources/js/services/admin/categoryService.js
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
 * Fetch all categories
 */
export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/categories`, {
            headers: getAuthHeaders()
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal memuat kategori."
        };
    }
};

/**
 * Create a new category
 */
export const createCategory = async (formData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/categories`,
            formData,
            { headers: getAuthHeaders() }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error creating category:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal menambahkan kategori.",
            errors: error.response?.data?.errors || null
        };
    }
};

/**
 * Update an existing category
 */
export const updateCategory = async (categoryId, formData) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/categories/${categoryId}`,
            formData,
            { headers: getAuthHeaders() }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error updating category:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal memperbarui kategori.",
            errors: error.response?.data?.errors || null
        };
    }
};

/**
 * Delete a category
 */
export const deleteCategory = async (categoryId) => {
    try {
        await axios.delete(`${API_BASE_URL}/api/categories/${categoryId}`, {
            headers: getAuthHeaders()
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting category:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal menghapus kategori.",
            status: error.response?.status
        };
    }
};
