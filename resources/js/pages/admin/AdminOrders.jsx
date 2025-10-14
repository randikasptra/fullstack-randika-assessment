import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Eye, XCircle, Clock, CheckCircle, Truck, Trash2 } from "lucide-react";
import adminOrderService from "../../services/admin/adminOrderService";
import AdminLayout from "../../layouts/AdminLayout";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [deletingOrderId, setDeletingOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await adminOrderService.getOrders();
            if (response.success) {
                setOrders(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching admin orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        if (!window.confirm(`Ubah status ke "${newStatus}"?`)) return;

        try {
            setUpdatingOrderId(orderId);
            const response = await adminOrderService.updateOrderStatus(orderId, newStatus);
            if (response.success) {
                alert("Status berhasil diubah!");
                fetchOrders(); // Refresh
            }
        } catch (error) {
            alert(error.message || "Gagal update status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Hapus order ini? Tindakan tidak bisa dibatalkan.")) return;

        try {
            setDeletingOrderId(orderId);
            const response = await adminOrderService.deleteOrder(orderId);
            if (response.success) {
                alert("Order berhasil dihapus");
                fetchOrders();
            }
        } catch (error) {
            alert(error.message || "Gagal hapus order");
        } finally {
            setDeletingOrderId(null);
        }
    };

    const formatCurrency = (amount) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

    const formatDate = (date) => new Date(date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, text: "Pending" },
            paid: { color: "bg-blue-100 text-blue-800", icon: CheckCircle, text: "Paid" },
            shipped: { color: "bg-indigo-100 text-indigo-800", icon: Truck, text: "Shipped" },
            completed: { color: "bg-green-100 text-green-800", icon: CheckCircle, text: "Completed" },
            cancelled: { color: "bg-red-100 text-red-800", icon: XCircle, text: "Cancelled" },
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                <Icon className="w-3 h-3" />
                {badge.text}
            </span>
        );
    };

    const filteredOrders = filterStatus === "all" ? orders : orders.filter((order) => order.status === filterStatus);

    // Skeleton loading mirip user
    const placeholderOrders = Array.from({ length: 5 }).map((_, index) => ({
        id: `placeholder-${index}`,
        created_at: new Date().toISOString(),
        status: "pending",
        total_price: 0,
        user: { name: "Memuat...", email: "memuat@example.com" },
    }));

    const displayOrders = loading ? placeholderOrders : filteredOrders;

    if (loading && orders.length === 0) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-xl">Loading orders...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
                    <p className="text-gray-600 mt-2">Kelola pesanan pelanggan</p>
                </div>

                {/* Filter mirip user, tapi simple */}
                <div className="mb-6 flex gap-2 flex-wrap">
                    {["all", "pending", "paid", "shipped", "completed", "cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg font-medium ${
                                filterStatus === status
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {status.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {displayOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    displayOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.user?.name || "N/A"}</div>
                                                <div className="text-sm text-gray-500">{order.user?.email || "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(order.total_price || 0)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.created_at || order.order_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    {order.status === "paid" && (
                                                        <button
                                                            onClick={() => handleStatusChange(order.id, "shipped")}
                                                            disabled={updatingOrderId === order.id}
                                                            className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 disabled:opacity-50"
                                                        >
                                                            {updatingOrderId === order.id ? "Updating..." : "Ship"}
                                                        </button>
                                                    )}
                                                    {order.status === "shipped" && (
                                                        <button
                                                            onClick={() => handleStatusChange(order.id, "completed")}
                                                            disabled={updatingOrderId === order.id}
                                                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            {updatingOrderId === order.id ? "Updating..." : "Complete"}
                                                        </button>
                                                    )}
                                                    {["paid", "shipped"].includes(order.status) && (
                                                        <button
                                                            onClick={() => handleStatusChange(order.id, "cancelled")}
                                                            disabled={updatingOrderId === order.id}
                                                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                    {["pending", "paid"].includes(order.status) && (
                                                        <button
                                                            onClick={() => handleDeleteOrder(order.id)}
                                                            disabled={deletingOrderId === order.id}
                                                            className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 disabled:opacity-50"
                                                        >
                                                            {deletingOrderId === order.id ? "Deleting..." : "Delete"}
                                                        </button>
                                                    )}
                                                    <Link
                                                        to={`/admin/detail-orders/${order.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 px-3 py-1"
                                                    >
                                                        <Eye className="w-4 h-4 inline" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
