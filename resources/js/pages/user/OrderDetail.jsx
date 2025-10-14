import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, XCircle } from 'lucide-react';
import cartService from '../../services/user/cartService';
import checkoutService from '../../services/user/checkoutService';
import paymentService from '../../services/user/paymentService';
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-600 dark:text-gray-400">Pesanan tidak ditemukan</p>
            </div>
        );
    }

    return (
        <UserLayout>

        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/user/orders')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Detail Pesanan
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Dibuat pada {new Date(order.order_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
                <div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Item Pesanan
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {order.order_items.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                                    <img
                                        src={item.book.image_url || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f'}
                                        alt={item.book.title}
                                        className="w-24 h-32 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                                            {item.book.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {item.book.author}
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                                        </p>
                                        <p className="text-lg font-bold text-green-700 mt-2">
                                            Subtotal: Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Alamat Pengiriman
                                </h2>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {order.shipping_address.recipient_name}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {order.shipping_address.phone}
                                    </p>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    {order.shipping_address.address}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary & Payment Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Ringkasan Pembayaran
                        </h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>Subtotal</span>
                                <span>Rp {order.total_price.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>Ongkir</span>
                                <span className="text-green-600">GRATIS</span>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                                    <span>Total</span>
                                    <span className="text-green-700">
                                        Rp {order.total_price.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        {order.payment_type && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        Metode Pembayaran
                                    </p>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 uppercase">
                                    {order.payment_type}
                                </p>
                            </div>
                        )}

                        {order.paid_at && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        Tanggal Pembayaran
                                    </p>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {new Date(order.paid_at).toLocaleDateString('id-ID', {
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
                        {order.status === 'pending' && (
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate(`/user/payment/${order.id}`)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition font-semibold"
                                >
                                    Bayar Sekarang
                                </button>
                                <button
                                    onClick={handleCancelOrder}
                                    className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-3 rounded-lg transition font-semibold"
                                >
                                    <XCircle className="w-5 h-5" />
                                    Batalkan Pesanan
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
