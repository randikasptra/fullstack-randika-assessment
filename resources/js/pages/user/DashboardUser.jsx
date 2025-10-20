import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart3,
    ShoppingCart,
    Package,
    BookOpen,
    TrendingUp,
    RefreshCw,
} from "lucide-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { toast } from "react-toastify";

// Components
import UserLayout from "../../layouts/UserLayout";
import StatsCard from "../../components/user/dashboard/StatsCard";
import BookGridItem from "../../components/user/dashboard/BookGridItem";
import RecentOrderItem from "../../components/user/dashboard/RecentOrderItem";
import LoadingSpinner from "../../components/user/LoadingSpinner";

// Services
import dashboardService from "../../services/user/dashboardService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
            console.log("📊 Dashboard Data Response:", response); // Debugging
            if (response.success) {
                setData({
                    statistics: response.data.statistics || {},
                    recent_orders: Array.isArray(response.data.recent_orders)
                        ? response.data.recent_orders.filter((item) => item && item.id)
                        : [],
                    popular_books: Array.isArray(response.data.popular_books)
                        ? response.data.popular_books.filter((item) => item && item.id)
                        : [],
                    monthly_spending: Array.isArray(response.data.monthly_spending)
                        ? response.data.monthly_spending.filter((item) => item && item.month)
                        : [],
                    suggested_books: Array.isArray(response.data.suggested_books)
                        ? response.data.suggested_books.filter((item) => item && item.id)
                        : [],
                });
            } else {
                throw new Error(response.message || "Gagal memuat data");
            }
        } catch (error) {
            console.error("❌ Dashboard Load Error:", error);
            toast.error(error.message || "Gagal memuat dashboard");
            navigate("/user/dashboard");
        } finally {
            setLoading(false);
        }
    };

    // Memoize chart data
    const chartData = useMemo(
        () => ({
            labels: data.monthly_spending.map((item) => item.month),
            datasets: [
                {
                    label: "Total Spending (Rp)",
                    data: data.monthly_spending.map((item) => parseInt(item.total)),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        }),
        [data.monthly_spending]
    );

    const chartOptions = useMemo(
        () => ({
            responsive: true,
            plugins: {
                legend: { position: "top" },
                title: {
                    display: true,
                    text: "Pengeluaran Bulanan (6 Bulan Terakhir)",
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => "Rp " + value.toLocaleString("id-ID"),
                    },
                },
            },
        }),
        []
    );

    const handleViewOrder = (orderId) => navigate(`/user/order-detail/${orderId}`);

    if (loading) {
        return (
            <UserLayout>
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <LoadingSpinner />
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Selamat datang kembali! Ini ringkasan aktivitas Anda.
                        </p>
                    </div>
                    <button
                        onClick={loadDashboardData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        aria-label="Refresh dashboard data"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        icon={Package}
                        title="Total Pesanan"
                        value={data.statistics.total_orders || 0}
                        color="text-blue-600"
                    />
                    <StatsCard
                        icon={BarChart3}
                        title="Total Pengeluaran"
                        value={`Rp ${(data.statistics.total_spending || 0)?.toLocaleString(
                            "id-ID"
                        )}`}
                        color="text-green-600"
                    />
                    <StatsCard
                        icon={ShoppingCart}
                        title="Item di Keranjang"
                        value={data.statistics.cart_items_count || 0}
                        color="text-orange-600"
                    />
                    <StatsCard
                        icon={TrendingUp}
                        title="Pesanan Berbayar"
                        value={data.statistics.paid_orders || 0}
                        color="text-purple-600"
                    />
                </div>

                {/* Grid: Chart + Suggested Books */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Monthly Spending Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart3 className="w-5 h-5 text-blue-600" aria-hidden="true" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Pengeluaran Bulanan
                            </h2>
                        </div>
                        {data.monthly_spending.length > 0 ? (
                            <div className="h-64">
                                <Bar options={chartOptions} data={chartData} />
                            </div>
                        ) : (
                            <p className="text-gray-500">Belum ada data pengeluaran.</p>
                        )}
                    </div>

                    {/* Suggested Books */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-blue-600" aria-hidden="true" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Rekomendasi Buku
                                </h2>
                            </div>
                            <button
                                onClick={() => navigate("/user/book-list")}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                aria-label="Lihat semua rekomendasi buku"
                            >
                                Lihat Semua
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {data.suggested_books
                                ?.filter((book) => book && book.id)
                                .slice(0, 4)
                                .map((book) => (
                                    <BookGridItem
                                        key={book.id}
                                        book={book}
                                        isPopular={false}
                                    />
                                ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                {data.recent_orders?.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Package className="w-5 h-5 text-blue-600" aria-hidden="true" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Pesanan Terbaru
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {data.recent_orders
                                ?.filter((order) => order && order.id)
                                .slice(0, 3)
                                .map((order) => (
                                    <RecentOrderItem
                                        key={order.id}
                                        order={order}
                                        onView={() => handleViewOrder(order.id)}
                                    />
                                ))}
                        </div>
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => navigate("/user/orders")}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                aria-label="Lihat semua pesanan"
                            >
                                Lihat Semua Pesanan
                            </button>
                        </div>
                    </div>
                )}

                {/* Popular Books */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="w-5 h-5 text-blue-600" aria-hidden="true" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Buku Favorit Anda
                        </h2>
                    </div>
                    {data.popular_books.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {data.popular_books
                                ?.filter((book) => book && book.id)
                                .map((book) => (
                                    <BookGridItem
                                        key={book.id}
                                        book={book}
                                        isPopular={true}
                                    />
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
