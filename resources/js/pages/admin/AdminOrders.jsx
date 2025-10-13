import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, XCircle, CheckCircle, Clock, Truck } from "lucide-react";
import { FaClipboardList } from "react-icons/fa";
import adminOrderService from "../../services/admin/adminOrderService";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [search, statusFilter, currentPage]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = { search, status: statusFilter, page: currentPage };
            const response = await adminOrderService.getOrders(params);
            console.log('API Response:', response); // Debug: Cek ini di console
            if (response.success) {
                setOrders(response.data.data || []); // Laravel paginate: response.data.data = array items
                setTotalPages(response.data.last_page || 1);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            alert(error.message || "Gagal memuat pesanan");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        if (!confirm(`Ubah status ke "${newStatus}"?`)) return;

        try {
            const response = await adminOrderService.updateStatus(orderId, newStatus);
            if (response.success) {
                alert("Status berhasil diupdate!");
                fetchOrders();
            }
        } catch (error) {
            alert(error.message || "Gagal update status");
        }
    };

    const handleCancel = async (orderId) => {
        if (!confirm("Batalkan pesanan ini?")) return;

        try {
            const response = await adminOrderService.cancelOrder(orderId);
            if (response.success) {
                alert("Pesanan berhasil dibatalkan!");
                fetchOrders();
            }
        } catch (error) {
            alert(error.message || "Gagal membatalkan");
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, text: "Pending" },
            paid: { color: "bg-blue-100 text-blue-800", icon: CheckCircle, text: "Paid" },
            shipped: { color: "bg-purple-100 text-purple-800", icon: Truck, text: "Shipped" },
            completed: { color: "bg-green-100 text-green-800", icon: CheckCircle, text: "Completed" },
            cancelled: { color: "bg-red-100 text-red-800", icon: XCircle, text: "Cancelled" },
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                <Icon className="w-3 h-3" />
                {badge.text}
            </span>
        );
    };

    const statusOptions = [
        { value: "", label: "Semua Status" },
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
        { value: "shipped", label: "Shipped" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <FaClipboardList className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Kelola Pesanan
                        </h1>
                    </div>
                    <div className="text-sm font-medium text-blue-600">Total: {orders.length} pesanan</div>
                </div>

                {/* Search & Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari ID order, nama user, atau email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                        <Filter className="w-4 h-4 inline mr-1" />
                        Filter
                    </button>
                </div>

                {/* Orders Table */}
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <FaClipboardList className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Belum Ada Pesanan
                        </h2>
                        <p className="text-gray-500">Tidak ada pesanan yang ditemukan.</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                #{order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {order.user?.name || order.user?.email || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {new Date(order.order_date).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                                Rp {order.total_price.toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Eye className="w-4 h-4 inline" />
                                                </button>
                                                {order.status !== 'cancelled' && (
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                        className="text-xs border rounded px-2 py-1 bg-white dark:bg-gray-700"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="paid">Paid</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                )}
                                                {order.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleCancel(order.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <XCircle className="w-4 h-4 inline" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Menampilkan {((currentPage - 1) * 10) + 1} sampai {Math.min(currentPage * 10, orders.length)} dari {totalPages * 10} hasil
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 border rounded disabled:opacity-50"
                                >
                                    Sebelumnya
                                </button>
                                <span className="px-3 py-2">Halaman {currentPage} dari {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 border rounded disabled:opacity-50"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
