// resources/js/pages/user/Orders.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Package,
    Eye,
    XCircle,
    Clock,
    CheckCircle,
    Truck,
    Trash2,
    CreditCard,
    Package2,
    Home,
    ArrowRight,
    AlertCircle,
} from "lucide-react";
import orderService from "../../services/user/orderService";
import { useOrderActions } from "../../services/user/useOrderActions";
import UserLayout from "../../layouts/UserLayout";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const navigate = useNavigate();
    const { handleCancelOrder, handleConfirmOrder, handleDeleteOrder, loading: actionLoading } = useOrderActions();

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrders();
            setOrders(response.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const onCancelOrder = async (orderId) => {
        const result = await handleCancelOrder(orderId);
        if (result?.success) {
            fetchOrders();
        }
    };

    const onConfirmOrder = async (orderId) => {
        const result = await handleConfirmOrder(orderId);
        if (result?.success) {
            fetchOrders();
        }
    };

    const onDeleteOrder = async (orderId) => {
        const result = await handleDeleteOrder(orderId);
        if (result?.success) {
            fetchOrders();
        }
    };

    // Filter orders berdasarkan tab aktif
    const filteredOrders = orders.filter((order) => {
        if (activeTab === "all") return true;
        if (activeTab === "pending") return order.status === "pending";
        if (activeTab === "processing") return order.status === "processing";
        if (activeTab === "paid") return order.status === "paid";
        if (activeTab === "shipped") return order.status === "shipped";
        if (activeTab === "completed") return order.status === "completed";
        if (activeTab === "cancelled")
            return order.status === "cancelled" || order.status === "expired";
        return true;
    });

    // Progress steps seperti Shopee
    const getProgressSteps = (status) => {
        const steps = [
            { key: "pending", label: "Belum Bayar", icon: Clock },
            {
                key: "processing",
                label: "Menunggu Pembayaran",
                icon: CreditCard,
            },
            { key: "paid", label: "Diproses", icon: Package2 },
            { key: "shipped", label: "Dikirim", icon: Truck },
            { key: "completed", label: "Selesai", icon: CheckCircle },
        ];

        const currentIndex = steps.findIndex((step) => step.key === status);

        return steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentIndex;
            const isCompleted = index < currentIndex;

            return (
                <div
                    key={step.key}
                    className="flex flex-col items-center flex-1"
                >
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                            isActive
                                ? isCompleted
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "bg-blue-500 border-blue-500 text-white"
                                : "bg-gray-100 border-gray-300 text-gray-400"
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                    </div>
                    <span
                        className={`text-xs mt-2 text-center ${
                            isActive
                                ? "text-blue-600 font-medium"
                                : "text-gray-500"
                        }`}
                    >
                        {step.label}
                    </span>
                </div>
            );
        });
    };

    // Status badge dengan icon
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: Clock,
                text: "Belum Bayar",
            },
            processing: {
                color: "bg-orange-100 text-orange-800 border-orange-200",
                icon: CreditCard,
                text: "Menunggu Pembayaran",
            },
            paid: {
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: Package2,
                text: "Sedang Diproses",
            },
            shipped: {
                color: "bg-purple-100 text-purple-800 border-purple-200",
                icon: Truck,
                text: "Sedang Dikirim",
            },
            completed: {
                color: "bg-green-100 text-green-800 border-green-200",
                icon: CheckCircle,
                text: "Selesai",
            },
            cancelled: {
                color: "bg-red-100 text-red-800 border-red-200",
                icon: XCircle,
                text: "Dibatalkan",
            },
            expired: {
                color: "bg-red-100 text-red-800 border-red-200",
                icon: AlertCircle,
                text: "Kadaluarsa",
            },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
            >
                <Icon className="w-4 h-4" />
                {config.text}
            </span>
        );
    };

    // Get action buttons berdasarkan status
    const getActionButtons = (order) => {
        switch (order.status) {
            case "pending":
                return (
                    <>
                        <button
                            onClick={() =>
                                navigate(`/user/payment/${order.id}`)
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                            Bayar Sekarang
                        </button>
                        <button
                            onClick={() => onCancelOrder(order.id)}
                            disabled={actionLoading}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition-all disabled:opacity-50"
                        >
                            <XCircle className="w-4 h-4" />
                            Batalkan
                        </button>
                    </>
                );

            case "processing":
                return (
                    <>
                        <button
                            onClick={() =>
                                navigate(`/user/payment/${order.id}`)
                            }
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                            Lihat Pembayaran
                        </button>
                        <button
                            onClick={() => onCancelOrder(order.id)}
                            disabled={actionLoading}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition-all disabled:opacity-50"
                        >
                            <XCircle className="w-4 h-4" />
                            Batalkan
                        </button>
                    </>
                );

            case "paid":
                return (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-all">
                        Pesanan Diproses
                    </button>
                );

            case "shipped":
                return (
                    <button
                        onClick={() => onConfirmOrder(order.id)}
                        disabled={actionLoading}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-medium transition-all disabled:opacity-50"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Pesanan Diterima
                    </button>
                );

            case "completed":
                return (
                    <button
                        onClick={() => navigate("/user/book-list")}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-medium transition-all"
                    >
                        Pesan Lagi
                    </button>
                );

            case "cancelled":
            case "expired":
                return (
                    <button
                        onClick={() => onDeleteOrder(order.id)}
                        disabled={actionLoading}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition-all disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                    </button>
                );

            default:
                return null;
        }
    };

    // Skeleton loading
    const SkeletonOrder = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>
            </div>
            <div className="p-6">
                <div className="flex gap-4 mb-4">
                    <div className="w-16 h-20 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="flex gap-2">
                        <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
                        <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
                    </div>
                </div>
            </div>
        </div>
    );

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
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Pesanan Saya
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    Kelola dan lacak pesanan Anda
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/user/book-list")}
                            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl shadow-lg border border-gray-200 transition-all"
                        >
                            <Home className="w-5 h-5" />
                            Belanja Lagi
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-8">
                        <div className="flex overflow-x-auto scrollbar-hide">
                            {[
                                {
                                    key: "all",
                                    label: "Semua",
                                    count: orders.length,
                                },
                                {
                                    key: "pending",
                                    label: "Belum Bayar",
                                    count: orders.filter(
                                        (o) => o.status === "pending"
                                    ).length,
                                },
                                {
                                    key: "processing",
                                    label: "Menunggu Pembayaran",
                                    count: orders.filter(
                                        (o) => o.status === "processing"
                                    ).length,
                                },
                                {
                                    key: "paid",
                                    label: "Diproses",
                                    count: orders.filter(
                                        (o) => o.status === "paid"
                                    ).length,
                                },
                                {
                                    key: "shipped",
                                    label: "Dikirim",
                                    count: orders.filter(
                                        (o) => o.status === "shipped"
                                    ).length,
                                },
                                {
                                    key: "completed",
                                    label: "Selesai",
                                    count: orders.filter(
                                        (o) => o.status === "completed"
                                    ).length,
                                },
                                {
                                    key: "cancelled",
                                    label: "Dibatalkan",
                                    count: orders.filter(
                                        (o) =>
                                            o.status === "cancelled" ||
                                            o.status === "expired"
                                    ).length,
                                },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                                        activeTab === tab.key
                                            ? "bg-blue-500 text-white shadow-lg"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                    }`}
                                >
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${
                                                activeTab === tab.key
                                                    ? "bg-white text-blue-500"
                                                    : "bg-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <SkeletonOrder key={i} />
                            ))}
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <Package className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                {activeTab === "all"
                                    ? "Belum Ada Pesanan"
                                    : `Tidak Ada Pesanan ${activeTab}`}
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
                        <div className="space-y-6">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                                >
                                    {/* Order Header */}
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="text-sm text-gray-600">
                                                    <div className="font-medium text-gray-900">
                                                        Pesanan •{" "}
                                                        {new Date(
                                                            order.order_date
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </div>
                                                    <div className="text-xs mt-1">
                                                        {
                                                            order.order_items
                                                                .length
                                                        }{" "}
                                                        item
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {getStatusBadge(order.status)}
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/user/orders/${order.id}`
                                                        )
                                                    }
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    Detail
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar untuk status yang berjalan */}
                                    {(order.status === "pending" ||
                                        order.status === "processing" ||
                                        order.status === "paid" ||
                                        order.status === "shipped" ||
                                        order.status === "completed") && (
                                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                            <div className="flex items-center justify-between mb-2">
                                                {getProgressSteps(order.status)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {order.order_items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex gap-4 items-start"
                                                >
                                                    <img
                                                        src={
                                                            item.book
                                                                .image_url ||
                                                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
                                                        }
                                                        alt={item.book.title}
                                                        className="w-16 h-20 object-cover rounded-lg shadow-sm"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                            {item.book.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mb-1">
                                                            {item.book.author}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {item.quantity} × Rp{" "}
                                                            {item.price.toLocaleString(
                                                                "id-ID"
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            Rp{" "}
                                                            {(
                                                                item.price *
                                                                item.quantity
                                                            ).toLocaleString(
                                                                "id-ID"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Shipping Address */}
                                        {order.shipping_address && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                    <Truck className="w-4 h-4" />
                                                    Alamat Pengiriman
                                                </h4>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p className="font-medium">
                                                        {
                                                            order
                                                                .shipping_address
                                                                .recipient_name
                                                        }{" "}
                                                        •{" "}
                                                        {
                                                            order
                                                                .shipping_address
                                                                .phone
                                                        }
                                                    </p>
                                                    <p>
                                                        {
                                                            order
                                                                .shipping_address
                                                                .address
                                                        }
                                                    </p>
                                                    <p>
                                                        {
                                                            order
                                                                .shipping_address
                                                                .city
                                                        }
                                                        ,{" "}
                                                        {
                                                            order
                                                                .shipping_address
                                                                .province
                                                        }{" "}
                                                        {
                                                            order
                                                                .shipping_address
                                                                .postal_code
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Total & Actions */}
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-6 border-t border-gray-100 mt-6">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 mb-1">
                                                    Total Pembayaran
                                                </p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {new Intl.NumberFormat(
                                                        "id-ID",
                                                        {
                                                            style: "currency",
                                                            currency: "IDR",
                                                            minimumFractionDigits: 0,
                                                        }
                                                    ).format(order.total_price)}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                {/* Tombol Detail */}
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/user/orders/${order.id}`
                                                        )
                                                    }
                                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Detail Pesanan
                                                </button>

                                                {/* Tombol Aksi Berdasarkan Status */}
                                                {getActionButtons(order)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
