// resources/js/services/user/bookService.js
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
    const token = getAuthToken();
    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
    };
};

/**
 * Fetch all books for user view
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
            error: error.response?.data?.message || "Gagal memuat daftar buku."
        };
    }
};

/**
 * Fetch all categories for user view
 * Using public endpoint or user-specific endpoint
 */
export const fetchCategories = async () => {
    try {
        // Try public endpoint first, fallback to auth endpoint
        const response = await axios.get(`${API_BASE_URL}/api/books/categories`, {
            headers: getAuthHeaders()
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching categories:", error);
        // If 403, might need different endpoint or public access
        if (error.response?.status === 403) {
            return {
                success: false,
                error: "Akses kategori dibatasi. Menampilkan semua buku.",
                needsPublicEndpoint: true
            };
        }
        return {
            success: false,
            error: error.response?.data?.message || "Gagal memuat kategori."
        };
    }
};

/**
 * Fetch current user data
 */
export const fetchUser = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/user`, {
            headers: getAuthHeaders()
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching user:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal memuat data user.",
            unauthorized: error.response?.status === 401
        };
    }
};

/**
 * Add book to cart
 */
export const addToCart = async (bookId) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/cart/add/${bookId}`,
            {},
            { headers: getAuthHeaders() }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error adding to cart:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal menambahkan ke keranjang."
        };
    }
};

/**
 * Get book by ID
 */
export const fetchBookById = async (bookId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/books/${bookId}`, {
            headers: getAuthHeaders()
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching book:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal memuat detail buku."
        };
    }
};
