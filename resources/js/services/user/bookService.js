import axios from 'axios';
import { API_BASE_URL } from '../../../config/api'; // Sesuaikan path

const getAuthToken = () => {
    return localStorage.getItem("auth_token");
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? {
        Authorization: `Bearer ${token}`
    } : {};
};

const bookService = {
    getAllBooks: async () => {
        try {
            // ❌ SALAH: API_URL tidak didefinisikan
            // const response = await axios.get(API_URL);

            // ✅ BENAR: Gunakan API_BASE_URL dengan endpoint lengkap
            const response = await axios.get(`${API_BASE_URL}/api/user/books`, {
                headers: getAuthHeaders()
            });

            // Return response.data (bisa array langsung atau object dengan property data)
            // Sesuaikan dengan controller Anda
            return response.data.data || response.data;
        } catch (error) {
            console.error("Error fetching books:", error);
            throw error.response?.data || error;
        }
    },

    getBookById: async (bookId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/books/${bookId}`, {
                headers: getAuthHeaders()
            });
            return response.data.data || response.data;
        } catch (error) {
            console.error("Error fetching book:", error);
            throw error.response?.data || error;
        }
    },

    searchBooks: async (query) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/books/search`, {
                params: { q: query },
                headers: getAuthHeaders()
            });
            return response.data.data || response.data;
        } catch (error) {
            console.error("Error searching books:", error);
            throw error.response?.data || error;
        }
    },
};

export default bookService;
