import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    Eye,
    XCircle,
    Clock,
    CheckCircle,
    Truck,
    Trash2,
    MoreVertical,
    Search,
    Filter,
    Download,
    User,
    Calendar,
    DollarSign,
    ShoppingCart,
    ArrowUpDown,
    Mail,
    Phone,
    MapPin,
    ChevronDown,
    Sparkles
} from "lucide-react";
import adminOrderService from "../../services/admin/adminOrderService";
import AdminLayout from "../../layouts/AdminLayout";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("semua");
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [deletingOrderId, setDeletingOrderId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

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
        if (!window.confirm(`Ubah status menjadi "${getStatusText(newStatus)}"?`)) return;

        try {
            setUpdatingOrderId(orderId);
            const response = await adminOrderService.updateOrderStatus(
                orderId,
                newStatus
            );
            if (response.success) {
                alert("Status berhasil diubah!");
                fetchOrders();
            }
        } catch (error) {
            alert(error.message || "Gagal update status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Hapus pesanan ini? Tindakan tidak bisa dibatalkan."))
            return;

        try {
            setDeletingOrderId(orderId);
            const response = await adminOrderService.deleteOrder(orderId);
            if (response.success) {
                alert("Pesanan berhasil dihapus");
                fetchOrders();
            }
        } catch (error) {
            alert(error.message || "Gagal hapus pesanan");
        } finally {
            setDeletingOrderId(null);
        }
    };

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: '2-digit',
            minute: '2-digit'
        });

    const getStatusText = (status) => {
        const statusMap = {
            pending: "Menunggu Pembayaran",
            paid: "Dibayar",
            processing: "Diproses",
            shipped: "Dikirim",
            completed: "Selesai",
            cancelled: "Dibatalkan"
        };
        return statusMap[status] || status;
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: {
                bgColor: "bg-gradient-to-r from-yellow-400 to-amber-500",
                textColor: "text-white",
                icon: Clock,
                text: "Menunggu",
            },
            paid: {
                bgColor: "bg-gradient-to-r from-blue-500 to-cyan-600",
                textColor: "text-white",
                icon: CheckCircle,
                text: "Dibayar",
            },
            processing: {
                bgColor: "bg-gradient-to-r from-orange-500 to-red-500",
                textColor: "text-white",
                icon: Package,
                text: "Diproses",
            },
            shipped: {
                bgColor: "bg-gradient-to-r from-purple-500 to-indigo-600",
                textColor: "text-white",
                icon: Truck,
                text: "Dikirim",
            },
            completed: {
                bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
                textColor: "text-white",
                icon: CheckCircle,
                text: "Selesai",
            },
            cancelled: {
                bgColor: "bg-gradient-to-r from-gray-500 to-slate-600",
                textColor: "text-white",
                icon: XCircle,
                text: "Dibatalkan",
            },
        };
        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;
        return (
            <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${badge.bgColor} ${badge.textColor}`}
            >
                <Icon className="w-4 h-4" />
                {badge.text}
            </span>
        );
    };

    // Filter dan sort pesanan
    const filteredOrders = orders
        .filter(order => {
            const matchesStatus = filterStatus === "semua" || order.status === filterStatus;
            const matchesSearch = order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                order.id?.toString().includes(searchTerm);
            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            if (sortConfig.key === 'total_price') {
                return sortConfig.direction === 'asc' ? a.total_price - b.total_price : b.total_price - a.total_price;
            }
            if (sortConfig.key === 'created_at') {
                return sortConfig.direction === 'asc'
                    ? new Date(a.created_at) - new Date(b.created_at)
                    : new Date(b.created_at) - new Date(a.created_at);
            }
            return 0;
        });

    const placeholderOrders = Array.from({ length: 5 }).map((_, index) => ({
        id: `placeholder-${index}`,
        created_at: new Date().toISOString(),
        status: "pending",
        total_price: 0,
        user: { name: "Memuat...", email: "memuat@example.com" },
        order_items: [],
        shipping_address: null,
    }));

    const displayOrders = loading ? placeholderOrders : filteredOrders;

    const statusCounts = {
        semua: orders.length,
        pending: orders.filter(order => order.status === 'pending').length,
        paid: orders.filter(order => order.status === 'paid').length,
        processing: orders.filter(order => order.status === 'processing').length,
        shipped: orders.filter(order => order.status === 'shipped').length,
        completed: orders.filter(order => order.status === 'completed').length,
        cancelled: orders.filter(order => order.status === 'cancelled').length,
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "from-yellow-400 to-amber-500",
            paid: "from-blue-500 to-cyan-600",
            processing: "from-orange-500 to-red-500",
            shipped: "from-purple-500 to-indigo-600",
            completed: "from-green-500 to-emerald-600",
            cancelled: "from-gray-500 to-slate-600",
        };
        return colors[status] || "from-gray-400 to-gray-600";
    };

    if (loading && orders.length === 0) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-xl">Memuat pesanan...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <ShoppingCart className="text-white text-xl" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Manajemen Pesanan
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Kelola semua pesanan pelanggan dengan mudah
                                </p>
                            </div>
                        </div>
                        {/* <button className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all shadow-lg hover:scale-105">
                            <Download className="w-5 h-5" />
                            <span className="font-semibold">Export Data</span>
                        </button> */}
                    </div>
                </div>

                {/* Stats Cards dengan Gradient */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                    {[
                        { key: "semua", label: "Semua", icon: Package, count: statusCounts.semua },
                        { key: "pending", label: "Menunggu", icon: Clock, count: statusCounts.pending },
                        { key: "paid", label: "Dibayar", icon: DollarSign, count: statusCounts.paid },
                        { key: "processing", label: "Diproses", icon: Package, count: statusCounts.processing },
                        { key: "shipped", label: "Dikirim", icon: Truck, count: statusCounts.shipped },
                        { key: "completed", label: "Selesai", icon: CheckCircle, count: statusCounts.completed },
                        { key: "cancelled", label: "Dibatalkan", icon: XCircle, count: statusCounts.cancelled },
                    ].map(({ key, label, icon: Icon, count }) => (
                        <div
                            key={key}
                            onClick={() => setFilterStatus(key)}
                            className={`bg-white rounded-2xl p-4 cursor-pointer transition-all transform hover:scale-105 shadow-lg border-2 ${
                                filterStatus === key
                                    ? `border-transparent bg-gradient-to-r ${getStatusColor(key)} text-white`
                                    : "border-gray-200 hover:border-blue-300 hover:shadow-xl"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-2xl font-bold ${
                                        filterStatus === key ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {count}
                                    </p>
                                    <p className={`text-sm mt-2 ${
                                        filterStatus === key ? 'text-blue-100' : 'text-gray-600'
                                    }`}>
                                        {label}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    filterStatus === key
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600'
                                }`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-8 shadow-xl">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Cari pesanan berdasarkan nama, email, atau ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-lg transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-lg">
                                <Filter className="text-gray-400 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700">Status:</span>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="border-0 bg-transparent text-sm font-medium text-gray-700 focus:outline-none focus:ring-0"
                                >
                                    <option value="semua">Semua Status</option>
                                    <option value="pending">Menunggu</option>
                                    <option value="paid">Dibayar</option>
                                    <option value="processing">Diproses</option>
                                    <option value="shipped">Dikirim</option>
                                    <option value="completed">Selesai</option>
                                    <option value="cancelled">Dibatalkan</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Grid Modern */}
                <div className="space-y-6">
                    {displayOrders.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-12 text-center shadow-xl">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                <Package className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-3">
                                Tidak ada pesanan ditemukan
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Coba ubah filter atau kata kunci pencarian Anda
                            </p>
                        </div>
                    ) : (
                        displayOrders.map((order) => (
                            <div key={order.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-slate-50 to-gray-100 px-6 py-4 border-b border-gray-200/50">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white rounded-xl p-2 shadow-lg">
                                                <div className="text-sm font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                    #{order.id}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span className="font-medium">{formatDate(order.created_at || order.order_date)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {getStatusBadge(order.status)}
                                            <div className="text-right">
                                                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                    {formatCurrency(order.total_price || 0)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.order_items?.length || 0} item
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Customer Info */}
                                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
                                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <User className="w-5 h-5 text-blue-600" />
                                                Informasi Pelanggan
                                            </h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                        {order.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {order.user?.name || "Tidak ada"}
                                                        </div>
                                                        <div className="text-sm text-gray-600 flex items-center gap-1">
                                                            <Mail className="w-4 h-4" />
                                                            {order.user?.email || "Tidak ada"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Package className="w-5 h-5 text-purple-600" />
                                                Item Pesanan
                                            </h4>
                                            <div className="space-y-3">
                                                {order.order_items?.slice(0, 2).map((item, index) => (
                                                    <div key={index} className="flex items-center gap-3">
                                                        <img
                                                            src={item.book?.image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"}
                                                            alt={item.book?.title}
                                                            className="w-12 h-16 object-cover rounded-lg shadow-sm"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-gray-900 text-sm line-clamp-1">
                                                                {item.book?.title || 'Produk tidak tersedia'}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {item.quantity} × {formatCurrency(item.price || 0)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.order_items?.length > 2 && (
                                                    <div className="text-sm text-gray-500 font-medium">
                                                        +{order.order_items.length - 2} item lainnya
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Shipping Info */}
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
                                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-green-600" />
                                                Alamat Pengiriman
                                            </h4>
                                            {order.shipping_address ? (
                                                <div className="space-y-2 text-sm">
                                                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                        <User className="w-4 h-4" />
                                                        {order.shipping_address.recipient_name}
                                                    </div>
                                                    <div className="text-gray-600 flex items-center gap-2">
                                                        <Phone className="w-4 h-4" />
                                                        {order.shipping_address.phone}
                                                    </div>
                                                    <div className="text-gray-600 line-clamp-2">
                                                        {order.shipping_address.address}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-gray-500 text-sm">
                                                    Alamat tidak tersedia
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200/50">
                                        <Link
                                            to={`/admin/detail-orders/${order.id}`}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                        >
                                            <Eye className="w-5 h-5" />
                                            Lihat Detail
                                        </Link>

                                        {/* Status Action Buttons */}
                                        <div className="flex flex-wrap gap-2">
                                            {order.status === "paid" && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, "processing")}
                                                    disabled={updatingOrderId === order.id}
                                                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                                >
                                                    <Package className="w-4 h-4" />
                                                    {updatingOrderId === order.id ? "Memproses..." : "Proses Pesanan"}
                                                </button>
                                            )}

                                            {order.status === "processing" && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, "shipped")}
                                                    disabled={updatingOrderId === order.id}
                                                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                                >
                                                    <Truck className="w-4 h-4" />
                                                    {updatingOrderId === order.id ? "Memperbarui..." : "Tandai Dikirim"}
                                                </button>
                                            )}

                                            {order.status === "shipped" && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, "completed")}
                                                    disabled={updatingOrderId === order.id}
                                                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    {updatingOrderId === order.id ? "Memperbarui..." : "Tandai Selesai"}
                                                </button>
                                            )}

                                            {["pending", "paid", "processing"].includes(order.status) && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, "cancelled")}
                                                    disabled={updatingOrderId === order.id}
                                                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Batalkan Pesanan
                                                </button>
                                            )}

                                            {["pending", "cancelled"].includes(order.status) && (
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    disabled={deletingOrderId === order.id}
                                                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    {deletingOrderId === order.id ? "Menghapus..." : "Hapus Pesanan"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
