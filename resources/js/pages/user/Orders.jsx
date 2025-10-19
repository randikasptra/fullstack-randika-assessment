import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Asumsi pake toastify

// Icons & Components
import {
    Package,
    Home,
    Eye,
    XCircle,
    Clock,
    CheckCircle,
    Truck,
    Trash2,
    CreditCard,
    Package2,
    ArrowRight,
    AlertCircle,
} from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import OrderCard from "../../components/user/orders/OrderCard"; // Baru
import StatusBadge from "../../components/user/orders/StatusBadge"; // Baru
import ProgressSteps from "../../components/user/orders/ProgressSteps"; // Baru
import ActionButtons from "../../components/user/orders/ActionButtons"; // Baru
import LoadingSpinner from "../../components/user/LoadingSpinner"; // Dari sebelumnya

// Services & Hooks
import orderService from "../../services/user/orderService";
import { useOrderActions } from "../../services/user/useOrderActions"; // Asumsi udah ada/enhance

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const navigate = useNavigate();
    const { handleCancelOrder, handleConfirmOrder, handleDeleteOrder, loading: actionLoading } = useOrderActions();

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000); // Auto-refresh
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrders({ page: 1, per_page: 50 });
            setOrders(response.data || []);
        } catch (error) {
            toast.error(error.message || "Gagal memuat pesanan");
        } finally {
            setLoading(false);
        }
    }, []);

    const onCancelOrder = useCallback(async (orderId) => {
        if (!window.confirm("Yakin batalkan pesanan ini? Stok akan dikembalikan.")) return;
        try {
            const result = await handleCancelOrder(orderId);
            if (result?.success) {
                toast.success("Pesanan dibatalkan!");
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [handleCancelOrder, fetchOrders]);

    const onConfirmOrder = useCallback(async (orderId) => {
        if (!window.confirm("Yakin pesanan sudah diterima?")) return;
        try {
            const result = await handleConfirmOrder(orderId);
            if (result?.success) {
                toast.success("Pesanan dikonfirmasi!");
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [handleConfirmOrder, fetchOrders]);

    const onDeleteOrder = useCallback(async (orderId) => {
        if (!window.confirm("Yakin hapus dari riwayat?")) return;
        try {
            const result = await handleDeleteOrder(orderId);
            if (result?.success) {
                toast.success("Pesanan dihapus!");
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [handleDeleteOrder, fetchOrders]);

    // Memoize filtered orders & tab counts
    const { filteredOrders, tabCounts } = useMemo(() => {
        const filtered = orders.filter((order) => {
            const statusMap = {
                all: true,
                pending: order.status === "pending",
                processing: order.status === "processing",
                paid: order.status === "paid",
                shipped: order.status === "shipped",
                completed: order.status === "completed",
                cancelled: ["cancelled", "expired"].includes(order.status),
            };
            return statusMap[activeTab] ?? true;
        });

        const counts = {
            all: orders.length,
            pending: orders.filter(o => o.status === "pending").length,
            processing: orders.filter(o => o.status === "processing").length,
            paid: orders.filter(o => o.status === "paid").length,
            shipped: orders.filter(o => o.status === "shipped").length,
            completed: orders.filter(o => o.status === "completed").length,
            cancelled: orders.filter(o => ["cancelled", "expired"].includes(o.status)).length,
        };

        return { filteredOrders: filtered, tabCounts: counts };
    }, [orders, activeTab]);

    if (loading) {
        return (
            <UserLayout>
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <LoadingSpinner />
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-500 rounded-2xl shadow-lg">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Pesanan Saya</h1>
                                <p className="text-gray-600 text-sm">Kelola dan lacak pesanan Anda</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/user/book-list")}
                            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl shadow-lg border border-gray-200 transition-all"
                            aria-label="Belanja lagi"
                        >
                            <Home className="w-5 h-5" />
                            Belanja Lagi
                        </button>
                    </div>

                    {/* Tabs */}
                    <nav role="tablist" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-8">
                        <div className="flex overflow-x-auto scrollbar-hide">
                            {[
                                { key: "all", label: "Semua" },
                                { key: "pending", label: "Belum Bayar" },
                                { key: "processing", label: "Menunggu Pembayaran" },
                                { key: "paid", label: "Diproses" },
                                { key: "shipped", label: "Dikirim" },
                                { key: "completed", label: "Selesai" },
                                { key: "cancelled", label: "Dibatalkan" },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    role="tab"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                                        activeTab === tab.key
                                            ? "bg-blue-500 text-white shadow-lg"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                    }`}
                                    aria-selected={activeTab === tab.key}
                                >
                                    {tab.label}
                                    {tabCounts[tab.key] > 0 && (
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${
                                                activeTab === tab.key
                                                    ? "bg-white text-blue-500"
                                                    : "bg-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {tabCounts[tab.key]}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Content */}
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100" role="alert">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <Package className="w-12 h-12 text-gray-400" aria-hidden="true" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                {activeTab === "all" ? "Belum Ada Pesanan" : `Tidak Ada Pesanan ${activeTab}`}
                            </h2>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                {activeTab === "all"
                                    ? "Mulai jelajahi koleksi buku kami dan temukan buku favorit Anda"
                                    : `Tidak ada pesanan dengan status ${activeTab}`}
                            </p>
                            <button
                                onClick={() => navigate("/user/book-list")}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all"
                            >
                                Mulai Belanja
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6" role="list">
                            {filteredOrders.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onViewDetail={() => navigate(`/user/orders/${order.id}`)}
                                    onCancel={onCancelOrder}
                                    onConfirm={onConfirmOrder}
                                    onDelete={onDeleteOrder}
                                    actionLoading={actionLoading}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
