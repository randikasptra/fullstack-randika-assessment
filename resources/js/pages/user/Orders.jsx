import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Eye, XCircle, Clock, CheckCircle, Truck } from "lucide-react";
import cartService from "../../services/user/cartService";
import checkoutService from "../../services/user/checkoutService";
import paymentService from "../../services/user/paymentService";
import orderService from "../../services/user/orderService";
import UserLayout from "../../layouts/UserLayout";


export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrders();
            setOrders(response.data);
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
        };

        const badge = badges[status] || badges.pending;
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

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

                {orders.length === 0 ? (
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
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
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
                                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Detail
                                            </button>

                                            {order.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/user/payment/${order.id}`
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                                                    >
                                                        Bayar Sekarang
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleCancelOrder(
                                                                order.id
                                                            )
                                                        }
                                                        className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Batalkan
                                                    </button>
                                                </>
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
