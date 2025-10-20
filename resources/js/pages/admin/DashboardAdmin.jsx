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

// Components from subfolder
import StatsCard from "../../components/admin/dashboard/StatsCard";
import ActivityItem from "../../components/admin/dashboard/ActivityItem";

const DashboardAdmin = () => {
    const [data, setData] = useState({
        statistics: {
            total_books: 0,
            total_users: 0,
            total_orders: 0,
            today_revenue: 0,
            new_users_today: 0,
            low_stock_books: 0, // Tambah dari backend
        },
        recent_activity: [],
        monthly_revenue: [], // Untuk chart
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
                setData({
                    ...response.data,
                    statistics: { ...response.data.statistics, low_stock_books: response.data.statistics.low_stock_books || 0 },
                });
            } else if (response && response.data) {
                // Some APIs return data directly without success flag
                console.log(
                    "⚠️ No success flag, but data exists:",
                    response.data
                );
                setData({
                    ...response.data,
                    statistics: { ...response.data.statistics, low_stock_books: response.data.statistics.low_stock_books || 0 },
                });
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

                {error ? (
                    <div className="flex justify-center items-center py-12 mb-8">
                        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
                            <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Error
                            </h2>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={loadDashboardData}
                                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Statistik Cards */}
                        <div className="mb-8">
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-xl shadow-md p-6 animate-pulse"
                                        >
                                            <div className="flex items-center">
                                                <div className="p-3 bg-gray-200 rounded-lg h-12 w-12"></div>
                                                <div className="ml-4 space-y-2 w-full">
                                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                    {/* Total Buku */}
                                    <StatsCard
                                        icon={FaBook}
                                        title="Total Buku"
                                        value={stats.total_books}
                                        color="blue"
                                    />

                                    {/* Total User */}
                                    <StatsCard
                                        icon={FaUsers}
                                        title="Total User"
                                        value={stats.total_users}
                                        color="indigo"
                                    />

                                    {/* Total Orders */}
                                    <StatsCard
                                        icon={FaShoppingCart}
                                        title="Total Orders"
                                        value={stats.total_orders}
                                        color="green"
                                    />

                                    {/* Penjualan Hari Ini */}
                                    <StatsCard
                                        icon={FaMoneyBillWave}
                                        title="Revenue Hari Ini"
                                        value={formatCurrency(stats.today_revenue)}
                                        color="yellow"
                                    />

                                    {/* Pelanggan Baru */}
                                    <StatsCard
                                        icon={FaUserPlus}
                                        title="User Baru Hari Ini"
                                        value={stats.new_users_today}
                                        color="purple"
                                    />
                                </div>
                            )}
                            {stats.low_stock_books > 0 && (
                                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                                    <p className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                                        ⚠️ {stats.low_stock_books} buku stok rendah. <button onClick={() => {/* Navigate */ }} className="underline">Cek sekarang</button>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Aktivitas Terbaru
                                </h2>
                            </div>
                            <div className="p-6">
                                {loading ? (
                                    <div className="space-y-3 animate-pulse">
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div
                                                key={index}
                                                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 bg-gray-200 rounded-full mr-4"></div>
                                                        <div className="space-y-2 flex-1">
                                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                        </div>
                                                    </div>
                                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : data.recent_activity.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.recent_activity.map((activity, index) => (
                                            <ActivityItem
                                                key={index}
                                                activity={activity}
                                            />
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
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default DashboardAdmin;
