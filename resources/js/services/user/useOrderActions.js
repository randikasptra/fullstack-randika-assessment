// resources/js/hooks/useOrderActions.js
import { useState } from 'react';
import orderService from './orderService';

export const useOrderActions = () => {
    const [loading, setLoading] = useState(false);

    const handleCancelOrder = async (orderId) => {
        if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;

        try {
            setLoading(true);
            const response = await orderService.cancelOrder(orderId);
            if (response.success) {
                alert("Pesanan berhasil dibatalkan");
                return { success: true };
            }
        } catch (error) {
            alert(error.message || "Gagal membatalkan pesanan");
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOrder = async (orderId) => {
        if (!confirm("Yakin ingin mengkonfirmasi pesanan ini sebagai selesai?")) return;

        try {
            setLoading(true);
            const response = await orderService.confirmOrder(orderId);
            if (response.success) {
                alert("Pesanan berhasil dikonfirmasi sebagai selesai");
                return { success: true };
            }
        } catch (error) {
            alert(error.message || "Gagal mengkonfirmasi pesanan");
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!confirm("Hapus pesanan ini dari riwayat? Tindakan ini tidak dapat dibatalkan.")) return;

        try {
            setLoading(true);
            const response = await orderService.deleteOrder(orderId);
            if (response.success) {
                alert("Pesanan berhasil dihapus dari riwayat");
                return { success: true };
            }
        } catch (error) {
            alert(error.message || "Gagal menghapus pesanan");
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    return {
        handleCancelOrder,
        handleConfirmOrder,
        handleDeleteOrder,
        loading,
    };
};
