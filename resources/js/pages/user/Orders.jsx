// resources/js/pages/user/Orders.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Eye, XCircle, Clock, CheckCircle, Truck, Trash2 } from "lucide-react";
import orderService from "../../services/user/orderService";
import UserLayout from "../../layouts/UserLayout";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();

        // Polling setiap 30 detik buat detect expired otomatis (fallback webhook)
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

    const handleCancelOrder = async (orderId) => {
        if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;

        try {
            const response = await orderService.cancelOrder(orderId);
            if (response.success) {
                alert("Pesanan berhasil dibatalkan");
                fetchOrders();
            }
        } catch (error) {
            alert(error.message || "Gagal membatalkan pesanan");
        }
    };

    // ✅ Handler untuk hapus order yang cancelled/expired
    const handleDeleteOrder = async (orderId) => {
        if (!confirm("Hapus pesanan ini dari riwayat? Tindakan ini tidak dapat dibatalkan.")) return;

        try {
            const response = await orderService.deleteOrder(orderId);
            if (response.success) {
                alert("Pesanan berhasil dihapus dari riwayat");
                fetchOrders(); // Refresh list
            }
        } catch (error) {
            alert(error.message || "Gagal menghapus pesanan");
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: {
                color: "bg-yellow-100 text-yellow-800",
                icon: Clock,
                text: "Menunggu Pembayaran",
            },
            paid: {
                color: "bg-blue-100 text-blue-800",
                icon: CheckCircle,
                text: "Dibayar",
            },
            shipped: {
                color: "bg-purple-100 text-purple-800",
                icon: Truck,
                text: "Dikirim",
            },
            completed: {
                color: "bg-green-100 text-green-800",
                icon: CheckCircle,
                text: "Selesai",
            },
            cancelled: {
                color: "bg-red-100 text-red-800",
                icon: XCircle,
                text: "Dibatalkan",
            },
            expired: {  // ✅ Tambah case expired (sama kayak cancelled)
                color: "bg-red-100 text-red-800",
                icon: XCircle,
                text: "Expired (Dibatalkan)",
            },
        };

        // Map expired ke cancelled badge kalau gak ada
        const effectiveStatus = status === 'expired' ? 'cancelled' : status;
        const badge = badges[effectiveStatus] || badges.pending;
        const Icon = badge.icon;

        return (
            <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
            >
                <Icon className="w-4 h-4" />
                {badge.text}
            </span>
        );
    };

    // Placeholder untuk skeleton loading
    const placeholderOrders = Array.from({ length: 3 }).map((_, index) => ({
        id: `placeholder-${index}`,
        order_date: new Date().toISOString(),
        status: "pending",
        order_items: [{
            id: `item-${index}`,
            book: {
                title: "Memuat...",
                author: "",
                image_url: "",
                price: 0
            },
            quantity: 1,
            price: 0
        }],
        shipping_address: null,
        total_price: 0
    }));

    const displayOrders = loading ? placeholderOrders : orders;

    return (
        <UserLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Package className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Pesanan Saya
                    </h1>
                </div>

                {loading || orders.length === 0 ? (
                    loading ? (
                        <div className="space-y-6">
                            {displayOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse"
                                >
                                    {/* Order Header */}
                                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b dark:border-gray-600">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                </div>
                                                <div>
                                                    <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                </div>
                                            </div>
                                            <div className="h-6 bg-gray-200 rounded-full w-32"></div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <div className="space-y-4 mb-4">
                                            <div className="flex gap-4 items-start">
                                                <div className="w-20 h-28 bg-gray-200 rounded-lg"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shipping Address Skeleton */}
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                            <div className="space-y-1">
                                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                            </div>
                                        </div>

                                        {/* Total & Actions */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t dark:border-gray-600">
                                            <div>
                                                <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                                                <div className="h-7 bg-gray-200 rounded w-32"></div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
                                                <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                                                <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Belum Ada Pesanan
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Anda belum memiliki riwayat pesanan
                            </p>
                            <button
                                onClick={() => navigate("/user/book-list")}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                            >
                                Mulai Belanja
                            </button>
                        </div>
                    )
                ) : (
                    <div className="space-y-6">
                        {displayOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b dark:border-gray-600">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Order ID
                                                </p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    #{order.id}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Tanggal
                                                </p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
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
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-4 mb-4">
                                        {order.order_items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex gap-4"
                                            >
                                                <img
                                                    src={
                                                        item.book.image_url ||
                                                        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
                                                    }
                                                    alt={item.book.title}
                                                    className="w-20 h-28 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                        {item.book.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {item.book.author}
                                                    </p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                                        {item.quantity} x Rp{" "}
                                                        {item.price.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900 dark:text-white">
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
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                Alamat Pengiriman
                                            </h4>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {
                                                    order.shipping_address
                                                        .recipient_name
                                                }{" "}
                                                - {order.shipping_address.phone}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {order.shipping_address.address}
                                                , {order.shipping_address.city},{" "}
                                                {
                                                    order.shipping_address
                                                        .province
                                                }{" "}
                                                {
                                                    order.shipping_address
                                                        .postal_code
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {/* Total & Actions */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t dark:border-gray-600">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Total Pembayaran
                                            </p>
                                            <p className="text-2xl font-bold text-green-700">
                                                Rp{" "}
                                                {order.total_price.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/user/orders/${order.id}`
                                                    )
                                                }
                                                disabled={loading}
                                                className={`flex items-center gap-2 ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'} text-gray-900 dark:text-white px-4 py-2 rounded-lg transition disabled:opacity-50`}
                                            >
                                                <Eye className="w-4 h-4" />
                                                Detail
                                            </button>

                                            {/* Tombol untuk status PENDING */}
                                            {order.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/user/payment/${order.id}`
                                                            )
                                                        }
                                                        disabled={loading}
                                                        className={`px-4 py-2 rounded-lg transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white disabled:opacity-50`}
                                                    >
                                                        Bayar Sekarang
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            !loading && handleCancelOrder(
                                                                order.id
                                                            )
                                                        }
                                                        disabled={loading}
                                                        className={`flex items-center gap-2 ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-100 hover:bg-red-200'} text-red-700 px-4 py-2 rounded-lg transition disabled:opacity-50`}
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Batalkan
                                                    </button>
                                                </>
                                            )}

                                            {/* ✅ Tombol HAPUS untuk status CANCELLED atau EXPIRED */}
                                            {(order.status === "cancelled" || order.status === "expired") && (
                                                <button
                                                    onClick={() =>
                                                        !loading && handleDeleteOrder(
                                                            order.id
                                                        )
                                                    }
                                                    disabled={loading}
                                                    className={`flex items-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white px-4 py-2 rounded-lg transition disabled:opacity-50`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
