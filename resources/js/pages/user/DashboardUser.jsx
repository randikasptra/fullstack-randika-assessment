import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, ShoppingCart, Package, BookOpen, TrendingUp } from "lucide-react";
import dashboardService from "../../services/user/dashboardService";
import UserLayout from "../../layouts/UserLayout";

export default function DashboardUser() {
    const [data, setData] = useState({
        statistics: {},
        recent_orders: [],
        popular_books: [],
        monthly_spending: [],
        suggested_books: [],
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getDashboardData();
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error("Error loading dashboard:", error);
            alert(error.message || "Gagal memuat dashboard");
        } finally {
            setLoading(false);
        }
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Selamat datang kembali! Ini ringkasan aktivitas Anda.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pesanan</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.statistics.total_orders}
                                </p>
                            </div>
                            <Package className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pengeluaran</p>
                                <p className="text-2xl font-bold text-green-600">
                                    Rp {data.statistics.total_spending?.toLocaleString("id-ID") || 0}
                                </p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Item di Keranjang</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {data.statistics.cart_items_count}
                                </p>
                            </div>
                            <ShoppingCart className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pesanan Berbayar</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {data.statistics.paid_orders}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Suggested Books */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Monthly Spending Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pengeluaran Bulanan (6 Bulan Terakhir)</h2>
                        </div>
                        {data.monthly_spending.length > 0 ? (
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-2">Bulan</th>
                                        <th className="px-4 py-2 text-right">Total (Rp)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.monthly_spending.map((month, index) => (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <td className="px-4 py-2 font-medium">{month.month}</td>
                                            <td className="px-4 py-2 text-right text-green-600 font-semibold">
                                                {parseInt(month.total).toLocaleString("id-ID")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">Belum ada data pengeluaran.</p>
                        )}
                    </div>

                    {/* Suggested Books */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Rekomendasi Buku</h2>
                            </div>
                            <button
                                onClick={() => navigate("/user/book-list")}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Lihat Semua
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {data.suggested_books.slice(0, 4).map((book) => (
                                <div key={book.id} className="text-center">
                                    <img
                                        src={book.image_url || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"}
                                        alt={book.title}
                                        className="w-full h-32 object-cover rounded-lg mb-2"
                                    />
                                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        {book.author}
                                    </p>
                                    <p className="text-sm font-bold text-green-600">
                                        Rp {book.price.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Popular Books */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Buku Favorit Anda</h2>
                        </div>
                    </div>
                    {data.popular_books.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {data.popular_books.map((book) => (
                                <div key={book.id} className="text-center">
                                    <img
                                        src={book.image_url || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"}
                                        alt={book.title}
                                        className="w-full h-32 object-cover rounded-lg mb-2"
                                    />
                                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Dibeli {book.total_purchased}x
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Belum ada buku favorit.</p>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
