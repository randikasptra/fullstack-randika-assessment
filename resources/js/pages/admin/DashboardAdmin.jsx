import React, { useState, useEffect } from "react";
import {
    FaBook,
    FaUsers,
    FaShoppingCart,
    FaMoneyBillWave,
    FaUserPlus,
    FaExclamationCircle,
} from "react-icons/fa";
import adminDashboardService from "../../services/admin/adminDashboardService";
import AdminLayout from "../../layouts/AdminLayout";


const DashboardAdmin = () => {
    const [data, setData] = useState({
        statistics: {
            total_books: 0,
            total_users: 0,
            total_orders: 0,
            today_revenue: 0,
            new_users_today: 0,
        },
        recent_activity: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("🔄 Starting to load dashboard data...");
            const response = await adminDashboardService.getDashboardData();

            console.log("📦 Received response:", response);

            // Check if response has success flag
            if (response && response.success) {
                console.log("✅ Success! Setting data:", response.data);
                setData(response.data);
            } else if (response && response.data) {
                // Some APIs return data directly without success flag
                console.log(
                    "⚠️ No success flag, but data exists:",
                    response.data
                );
                setData(response.data);
            } else {
                console.log("❌ Invalid response format:", response);
                setError("Format response tidak valid");
            }
        } catch (error) {
            console.error("❌ Error loading admin dashboard:", error);
            console.error("Error details:", {
                message: error.message,
                status: error.status,
                details: error.details,
            });

            setError(
                error.message ||
                    error.details?.message ||
                    "Gagal memuat dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
                    <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        Error
                    </h2>
                    <p className="text-gray-600 text-center mb-4">{error}</p>
                    <button
                        onClick={loadDashboardData}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const stats = data.statistics;

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                {/* Header */}
                <header className="bg-white shadow-sm rounded-xl mb-6 p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Dashboard Admin
                    </h1>
                    <p className="text-gray-600">
                        Selamat datang di sistem manajemen MouraBook Store
                    </p>
                </header>

                {/* Statistik Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {/* Total Buku */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FaBook className="text-2xl text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-600">
                                    Total Buku
                                </h3>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.total_books}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total User */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <FaUsers className="text-2xl text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-600">
                                    Total User
                                </h3>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.total_users}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FaShoppingCart className="text-2xl text-green-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-600">
                                    Total Orders
                                </h3>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.total_orders}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Penjualan Hari Ini */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <FaMoneyBillWave className="text-2xl text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-600">
                                    Revenue Hari Ini
                                </h3>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(stats.today_revenue)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pelanggan Baru */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <FaUserPlus className="text-2xl text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-600">
                                    User Baru Hari Ini
                                </h3>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.new_users_today}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Aktivitas Terbaru
                        </h2>
                    </div>
                    <div className="p-6">
                        {data.recent_activity.length > 0 ? (
                            <div className="space-y-3">
                                {data.recent_activity.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                                    >
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-4">
                                                {activity.type === "order"
                                                    ? "🛒"
                                                    : "👤"}
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {activity.title}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {activity.description}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                                            {activity.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg">
                                    Belum ada aktivitas terbaru
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default DashboardAdmin;
