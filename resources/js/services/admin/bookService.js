// resources/js/services/admin/bookService.js
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
 * Fetch all books
 */
export const fetchBooks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/books`, {
            headers: getAuthHeaders()
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching books:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal memuat buku."
        };
    }
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
 * Create a new book
 */
export const createBook = async (formData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/books`,
            formData,
            {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error creating book:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal menambahkan buku."
        };
    }
};

/**
 * Update an existing book
 * Using POST method because Laravel doesn't support PUT with file upload
 */
export const updateBook = async (bookId, formData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/books/${bookId}`,
            formData,
            {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error updating book:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal memperbarui buku."
        };
    }
};

/**
 * Delete a book
 */
export const deleteBook = async (bookId) => {
    try {
        await axios.delete(`${API_BASE_URL}/api/books/${bookId}`, {
            headers: getAuthHeaders()
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting book:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal menghapus buku."
        };
    }
};
