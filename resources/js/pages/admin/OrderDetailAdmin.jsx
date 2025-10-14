import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, XCircle, Truck, CheckCircle, Clock } from "lucide-react";
import adminOrderService from "../../services/admin/adminOrderService";
import AdminLayout from "../../layouts/AdminLayout";

const OrderDetailAdmin = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [newStatus, setNewStatus] = useState("");

    const statusOptions = [
        { value: "pending", label: "Pending", icon: Clock },
        { value: "paid", label: "Paid", icon: CreditCard },
        { value: "shipped", label: "Shipped", icon: Truck },
        { value: "completed", label: "Completed", icon: CheckCircle },
        { value: "cancelled", label: "Cancelled", icon: XCircle },
    ];

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await adminOrderService.getOrderById(id);
            console.log('Full response from API:', response);  // Debug: Liat data ada apa
            if (response.success) {
                const data = response.data;
                const transformedOrder = {
                    ...data,
                    orderItems: data.order_items || [],
                    shippingAddress: data.shipping_address,
                };
                setOrder(transformedOrder);
                setTrackingNumber(data.tracking_number || "");
                setNotes(data.notes || "");
                setNewStatus(data.status);
            } else {
                alert(response.message || 'Gagal load order');
            }
        } catch (error) {
            console.error('Error fetching admin order:', error);
            alert(error.message || 'Gagal load order');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        if (!newStatus) return;
        if (!window.confirm(`Ubah status ke "${newStatus}"?`)) return;

        try {
            setUpdating(true);
            const response = await adminOrderService.updateOrderStatus(id, newStatus);
            if (response.success) {
                alert('Status berhasil diubah');
                fetchOrder();  // Refresh
            }
        } catch (error) {
            alert(error.message || 'Gagal update status');
        } finally {
            setUpdating(false);
        }
    };

    const handleSaveTrackingAndNotes = async (e) => {
        e.preventDefault();
        try {
            const response = await adminOrderService.updateTrackingAndNotes(id, {
                tracking_number: trackingNumber,
                notes: notes,
            });
            if (response.success) {
                alert('Tracking & notes berhasil disimpan');
                fetchOrder();
            }
        } catch (error) {
            alert(error.message || 'Gagal simpan');
        }
    };

    const formatCurrency = (amount) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

    const formatDate = (date) => new Date(date).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-blue-100 text-blue-800',
            shipped: 'bg-indigo-100 text-indigo-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || colors.pending;
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-xl">Loading order details...</div>
                </div>
            </AdminLayout>
        );
    }

    if (!order) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-xl text-red-600">Order not found</div>
                    <Link to="/admin/orders-list" className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded">
                        Back to Orders
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-8 flex items-center gap-4">
                    <Link to="/admin/orders-list" className="p-2 rounded-lg hover:bg-gray-100">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">Detail Order #{order.id}</h1>
                        <p className="text-gray-600">Dibuat pada {formatDate(order.order_date || order.created_at)}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                    </span>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
                            </div>
                            <div className="space-y-4">
                                {order.orderItems && order.orderItems.length > 0 ? (
                                    order.orderItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                                            <img
                                                src={item.book?.image_url || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                                                alt={item.book?.title}
                                                className="w-24 h-32 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.book?.title || "N/A"}</h3>
                                                {item.book?.author && (
                                                    <p className="text-sm text-gray-600 mb-1">by {item.book.author}</p>
                                                )}
                                                {item.book?.publisher && (
                                                    <p className="text-sm text-gray-600 mb-2">{item.book.publisher}, {item.book.year}</p>
                                                )}
                                                <p className="text-sm text-gray-600 mb-2">Qty: {item.quantity}</p>
                                                <p className="text-sm text-gray-700">Price: {formatCurrency(item.book?.price || 0)}</p>
                                                <p className="text-lg font-bold text-green-700 mt-2">Subtotal: {formatCurrency((item.book?.price || 0) * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No items in this order</p>
                                )}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        {order.shippingAddress ? (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-semibold text-gray-900">{order.shippingAddress.recipient_name}</p>
                                    <p className="text-gray-700">{order.shippingAddress.phone}</p>
                                    <p className="text-gray-700">{order.shippingAddress.address}</p>
                                    <p className="text-gray-600">
                                        {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postal_code}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <p className="text-gray-500 italic">No shipping address provided</p>
                            </div>
                        )}
                    </div>

                    {/* Summary & Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Ringkasan</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Customer</span>
                                    <span>{order.user?.name || "N/A"}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Email</span>
                                    <span className="text-sm">{order.user?.email || "N/A"}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-green-700">{formatCurrency(order.total_price || 0)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Update Status Form */}
                            <form onSubmit={handleStatusUpdate} className="space-y-4 mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700">Update Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={updating}
                                >
                                    {statusOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    disabled={updating || newStatus === order.status}
                                    className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    {updating ? "Updating..." : "Update Status"}
                                </button>
                            </form>

                            {/* Tracking & Notes Form */}
                            <form onSubmit={handleSaveTrackingAndNotes} className="space-y-4">
                                {order.status === "shipped" && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">Tracking Number</label>
                                        <input
                                            type="text"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Masukkan nomor tracking"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Admin Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                        placeholder="Catatan admin untuk order ini..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 font-medium transition-colors"
                                    disabled={!notes && !trackingNumber && order.status !== "shipped"}
                                >
                                    Save Tracking & Notes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrderDetailAdmin;
