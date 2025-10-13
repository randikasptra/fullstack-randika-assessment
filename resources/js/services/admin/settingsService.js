// resources/js/services/admin/settingsService.js
import axios from "../../utils/axios";

/**
 * Fetch user profile data
 */
export const fetchProfile = async () => {
    try {
        console.log("Token saat fetchProfile:", localStorage.getItem("auth_token"));
        const response = await axios.get("/settings/profile");
        console.log("Response profile:", response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching profile:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal memuat data pengguna. Pastikan login."
        };
    }
};

/**
 * Update user name
 */
export const updateName = async (name) => {
    try {
        const response = await axios.put("/settings/update-name", { name });
        console.log("Update name response:", response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error updating name:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Gagal memperbarui nama."
        };
    }
};

/**
 * Update user password
 */
export const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
        const response = await axios.put("/settings/update-password", {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
        });
        console.log("Update password response:", response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error updating password:", error);
        return {
            success: false,
            error: error.response?.data?.errors?.current_password?.[0] ||
                   error.response?.data?.message ||
                   "Gagal memperbarui password."
        };
    }
};
