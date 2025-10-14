import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, XCircle, CheckCircle } from 'lucide-react';
import orderService from '../../services/user/orderService';
import UserLayout from "../../layouts/UserLayout";

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrderDetail(id);
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching order detail:', error);
            alert(error.message || 'Gagal memuat detail pesanan');
            navigate('/user/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!confirm('Yakin ingin membatalkan pesanan ini?')) return;

        try {
            const response = await orderService.cancelOrder(id);
            if (response.success) {
                alert('Pesanan berhasil dibatalkan');
                fetchOrderDetail();
            }
        } catch (error) {
            alert(error.message || 'Gagal membatalkan pesanan');
        }
    };

    const handleConfirmOrder = async () => {
        if (!confirm('Yakin ingin mengkonfirmasi pesanan ini sebagai selesai?')) return;

        try {
            const response = await orderService.confirmOrder(id);
            if (response.success) {
                alert('Pesanan berhasil dikonfirmasi sebagai selesai');
                fetchOrderDetail();
            }
        } catch (error) {
            alert(error.message || 'Gagal mengkonfirmasi pesanan');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'text-yellow-600 bg-yellow-100',
            paid: 'text-blue-600 bg-blue-100',
            shipped: 'text-purple-600 bg-purple-100',
            completed: 'text-green-600 bg-green-100',
            cancelled: 'text-red-600 bg-red-100',
        };
        return colors[status] || colors.pending;
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Menunggu Pembayaran',
            paid: 'Dibayar - Sedang Diproses',
            shipped: 'Dalam Pengiriman',
            completed: 'Pesanan Selesai',
            cancelled: 'Dibatalkan',
        };
        return texts[status] || status;
    };

    // Placeholder data for skeleton
    const placeholderOrder = {
        id: id || "000",
        order_date: new Date().toISOString(),
        status: "pending",
        order_items: [{
            id: "placeholder",
            book: {
                title: "Memuat...",
                author: "",
                image_url: "",
                price: 0
            },
            quantity: 1,
            price: 0
        }],
        shipping_address: {
            recipient_name: "Memuat...",
            phone: "",
            address: "Memuat...",
            city: "Memuat...",
            province: "Memuat...",
            postal_code: ""
        },
        total_price: 0,
        payment_type: "",
        paid_at: null
    };

    const displayOrder = loading ? placeholderOrder : order;

    return (
        <UserLayout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/user/orders')}
                        disabled={loading}
                        className={`p-2 rounded-lg transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <ArrowLeft className={`w-6 h-6 ${loading ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`} />
                    </button>
                    <div className="flex-1">
                        <h1 className={`text-3xl font-bold ${loading ? 'text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                            Detail Pesanan
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-400 mt-1 ${loading ? 'animate-pulse' : ''}`}>
                            {loading ? "Memuat..." : `Dibuat pada ${new Date(displayOrder.order_date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}`}
                        </p>
                    </div>
                    <div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${loading ? 'bg-gray-200 text-gray-300' : getStatusColor(displayOrder.status)}`}>
                            {loading ? "Memuat..." : getStatusText(displayOrder.status)}
                        </span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${loading ? 'animate-pulse' : ''}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <Package className={`w-5 h-5 ${loading ? 'text-gray-300' : 'text-blue-600'}`} />
                                <h2 className={`text-xl font-bold ${loading ? 'text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                    Item Pesanan
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {displayOrder.order_items.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                                        <img
                                            src={loading ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgOTYgMTI4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iOTYiIGhlaWdodD0iMTI4IiBmaWxsPSIjRTVFNUI1Ii8+Cjwvc3ZnPgo=" : (item.book.image_url || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')}
                                            alt={item.book.title}
                                            className={`w-24 h-32 object-cover rounded-lg ${loading ? 'animate-pulse bg-gray-200' : ''}`}
                                        />
                                        <div className="flex-1">
                                            <h3 className={`font-semibold text-lg ${loading ? 'text-gray-300' : 'text-gray-900 dark:text-white'} mb-1`}>
                                                {loading ? "Memuat..." : item.book.title}
                                            </h3>
                                            <p className={`text-sm ${loading ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'} mb-2 animate-pulse`}>
                                                {loading ? "Memuat..." : item.book.author}
                                            </p>
                                            <p className={`text-sm ${loading ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {loading ? "1 x Rp 0" : `${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}`}
                                            </p>
                                            <p className={`text-lg font-bold ${loading ? 'text-gray-300' : 'text-green-700'} mt-2`}>
                                                {loading ? "Subtotal: Rp 0" : `Subtotal: Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        {displayOrder.shipping_address && (
                            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${loading ? 'animate-pulse' : ''}`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className={`w-5 h-5 ${loading ? 'text-gray-300' : 'text-blue-600'}`} />
                                    <h2 className={`text-xl font-bold ${loading ? 'text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                        Alamat Pengiriman
                                    </h2>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <p className={`font-semibold ${loading ? 'text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                            {loading ? "Memuat..." : displayOrder.shipping_address.recipient_name}
                                        </p>
                                        <p className={` ${loading ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {loading ? "Memuat..." : displayOrder.shipping_address.phone}
                                        </p>
                                    </div>
                                    <p className={` ${loading ? 'text-gray-300 animate-pulse' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {loading ? "Memuat..." : displayOrder.shipping_address.address}
                                    </p>
                                    <p className={` ${loading ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {loading ? "Memuat..." : `${displayOrder.shipping_address.city}, ${displayOrder.shipping_address.province} ${displayOrder.shipping_address.postal_code}`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary & Payment Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-4 ${loading ? 'animate-pulse' : ''}`}>
                            <h2 className={`text-xl font-bold ${loading ? 'text-gray-300' : 'text-gray-900 dark:text-white'} mb-4`}>
                                Ringkasan Pembayaran
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                    <span>Subtotal</span>
                                    <span>{loading ? "Rp 0" : `Rp ${displayOrder.total_price.toLocaleString('id-ID')}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                    <span>Ongkir</span>
                                    <span className="text-green-600">GRATIS</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                                        <span>Total</span>
                                        <span className={loading ? 'text-gray-300' : "text-green-700"}>
                                            {loading ? "Rp 0" : `Rp ${displayOrder.total_price.toLocaleString('id-ID')}`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            {displayOrder.payment_type && (
                                <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 ${loading ? 'animate-pulse' : ''}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard className={`w-4 h-4 ${loading ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`} />
                                        <p className={`font-semibold ${loading ? 'text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                            Metode Pembayaran
                                        </p>
                                    </div>
                                    <p className={`text-sm ${loading ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} uppercase`}>
                                        {loading ? "Memuat..." : displayOrder.payment_type}
                                    </p>
                                </div>
                            )}

                            {displayOrder.paid_at && (
                                <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 ${loading ? 'animate-pulse' : ''}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className={`w-4 h-4 ${loading ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`} />
                                        <p className={`font-semibold ${loading ? 'text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                            Tanggal Pembayaran
                                        </p>
                                    </div>
                                    <p className={`text-sm ${loading ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {loading ? "Memuat..." : new Date(displayOrder.paid_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            {displayOrder.status === 'pending' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate(`/user/payment/${displayOrder.id}`)}
                                        disabled={loading}
                                        className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-3 rounded-lg transition font-semibold`}
                                    >
                                        {loading ? "Memuat..." : "Bayar Sekarang"}
                                    </button>
                                    <button
                                        onClick={handleCancelOrder}
                                        disabled={loading}
                                        className={`w-full flex items-center justify-center gap-2 ${loading ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-red-100 hover:bg-red-200 text-red-700'} px-4 py-3 rounded-lg transition font-semibold`}
                                    >
                                        <XCircle className={`w-5 h-5 ${loading ? 'text-gray-300' : ''}`} />
                                        {loading ? "Memuat..." : "Batalkan Pesanan"}
                                    </button>
                                </div>
                            )}

                            {displayOrder.status === 'shipped' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={handleConfirmOrder}
                                        disabled={loading}
                                        className={`w-full flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed text-gray-500' : 'bg-green-100 hover:bg-green-200 text-green-700'} px-4 py-3 rounded-lg transition font-semibold`}
                                    >
                                        <CheckCircle className={`w-5 h-5 ${loading ? 'text-gray-300' : ''}`} />
                                        {loading ? "Memuat..." : "Konfirmasi Selesai"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
