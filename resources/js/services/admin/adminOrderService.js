import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

const API_URL = `${API_BASE_URL}/api/admin/orders`;

// Ambil token dari localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminOrderService = {
    /**
     * Ambil semua orders
     * Response: { success: true, data: [...] }
     */
    async getOrders() {
        try {
            const response = await axios.get(API_URL, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    success: false,
                    message: error.message || "Failed to load orders",
                }
            );
        }
    },

    /**
     * Ambil detail order by ID
     * Response: { success: true, data: {...} }
     */
    // Di adminOrderService.js, method getOrderById
    async getOrderById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: getAuthHeader(),
            });
            console.log("Admin getOrderById response:", response.data); // Debug: Liat data
            return response.data;
        } catch (error) {
            console.error(
                "Admin getOrderById error:",
                error.response?.data || error
            ); // Debug error
            throw (
                error.response?.data || {
                    success: false,
                    message: "Order not found",
                }
            );
        }
    },

    /**
     * Update status order (hanya: shipped, completed, cancelled)
     * Response: { success: true, message: '...', data: {...} }
     */
    async updateOrderStatus(id, status) {
        try {
            const response = await axios.patch(
                `${API_URL}/${id}/status`,
                { status },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    success: false,
                    message: "Failed to update status",
                }
            );
        }
    },

    /**
     * Update tracking number and notes
     * Response: { success: true, message: '...', data: {...} }
     */
    async updateTrackingAndNotes(id, data) {
        try {
            const response = await axios.patch(
                `${API_URL}/${id}/tracking-notes`,
                data,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    success: false,
                    message: "Failed to update tracking/notes",
                }
            );
        }
    },

    /**
     * Delete order (opsional)
     * Response: { success: true, message: '...' }
     */
    async deleteOrder(id) {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    success: false,
                    message: "Failed to delete order",
                }
            );
        }
    },
};

export default adminOrderService;
