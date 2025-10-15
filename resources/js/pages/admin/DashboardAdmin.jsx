import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import adminDashboardService from "../../services/admin/adminDashboardService"; // Service baru

const DashboardAdmin = () => {
    const [data, setData] = useState({
        statistics: {},
        recent_activity: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const response = await adminDashboardService.getDashboardData();
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error("Error loading admin dashboard:", error);
            alert(error.message || "Gagal memuat dashboard");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
    };

    const formatTime = (time) => {
        return time; // Udah diffForHumans dari backend
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-xl">Loading dashboard...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Header */}
            <header className="bg-white shadow-sm mb-6">
                <div className="px-6 py-4">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Dashboard Admin
                    </h1>
                    <p className="text-gray-600">
                        Selamat datang di sistem manajemen penjualan buku
                    </p>
                </div>
            </header>

            {/* Statistik Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <span className="text-2xl">📚</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-700">Total Buku</h3>
                            <p className="text-2xl font-bold text-gray-900">{data.statistics.total_books || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-700">Total User</h3>
                            <p className="text-2xl font-bold text-gray-900">{data.statistics.total_users || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <span className="text-2xl">🛒</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
                            <p className="text-2xl font-bold text-gray-900">{data.statistics.total_orders || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <span className="text-2xl">💰</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-700">Penjualan Hari Ini</h3>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.statistics.today_revenue || 0)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <span className="text-2xl">➕</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-700">Pelanggan Baru</h3>
                            <p className="text-2xl font-bold text-gray-900">{data.statistics.new_users_today || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Aktivitas Terbaru</h2>
                </div>
                <div className="p-6 space-y-4">
                    {data.recent_activity.length > 0 ? (
                        data.recent_activity.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <span className="text-lg mr-3">
                                        {activity.type === 'order' ? '🛒' : '👤'}
                                    </span>
                                    <div>
                                        <p className="font-medium">{activity.title}</p>
                                        <p className="text-sm text-gray-600">{activity.description}</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">{formatTime(activity.time)}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">Belum ada aktivitas.</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default DashboardAdmin;
