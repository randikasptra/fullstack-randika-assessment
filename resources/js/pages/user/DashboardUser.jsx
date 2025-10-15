import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import {
    BarChart3,
    ShoppingCart,
    Package,
    BookOpen,
    TrendingUp,
    RefreshCw,
} from "lucide-react";
=======
import { BarChart3, ShoppingCart, Package, BookOpen, TrendingUp, RefreshCw } from "lucide-react";
>>>>>>> f973aa1 (fix(bokklist): redesign booklist)
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
<<<<<<< HEAD
} from "chart.js";
import { Bar } from "react-chartjs-2";
=======
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
>>>>>>> f973aa1 (fix(bokklist): redesign booklist)
import dashboardService from "../../services/user/dashboardService";
import UserLayout from "../../layouts/UserLayout";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

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

    // Chart data for monthly spending
    const chartData = {
<<<<<<< HEAD
        labels: data.monthly_spending.map((item) => item.month),
        datasets: [
            {
                label: "Total Spending (Rp)",
                data: data.monthly_spending.map((item) => parseInt(item.total)),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
=======
        labels: data.monthly_spending.map(item => item.month),
        datasets: [
            {
                label: 'Total Spending (Rp)',
                data: data.monthly_spending.map(item => parseInt(item.total)),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
>>>>>>> f973aa1 (fix(bokklist): redesign booklist)
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
<<<<<<< HEAD
                position: "top",
            },
            title: {
                display: true,
                text: "Pengeluaran Bulanan (6 Bulan Terakhir)",
=======
                position: 'top',
            },
            title: {
                display: true,
                text: 'Pengeluaran Bulanan (6 Bulan Terakhir)',
>>>>>>> f973aa1 (fix(bokklist): redesign booklist)
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
<<<<<<< HEAD
                    callback: function (value) {
                        return "Rp " + value.toLocaleString("id-ID");
                    },
                },
            },
        },
=======
                    callback: function(value) {
                        return 'Rp ' + value.toLocaleString('id-ID');
                    }
                }
            }
        }
>>>>>>> f973aa1 (fix(bokklist): redesign booklist)
    };

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
<<<<<<< HEAD
                            Selamat datang kembali! Ini ringkasan aktivitas
                            Anda.
=======
                            Selamat datang kembali! Ini ringkasan aktivitas Anda.
>>>>>>> f973aa1 (fix(bokklist): redesign booklist)
                        </p>
                    </div>
                    <button
                        onClick={loadDashboardData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
<<<<<<< HEAD
                        <RefreshCw
                            className={`w-4 h-4 ${
                                loading ? "animate-spin" : ""
                            }`}
                        />
=======
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
>>>>>>> f973aa1 (fix(bokklist): redesign booklist)
                        Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Pesanan
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {loading
                                        ? "..."
                                        : data.statistics.total_orders || 0}
                                </p>
                            </div>
                            <Package className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Pengeluaran
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    Rp{" "}
                                    {(loading
                                        ? 0
                                        : data.statistics.total_spending || 0
                                    )?.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Item di Keranjang
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {loading
                                        ? "..."
                                        : data.statistics.cart_items_count || 0}
                                </p>
                            </div>
                            <ShoppingCart className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Pesanan Berbayar
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {loading
                                        ? "..."
                                        : data.statistics.paid_orders || 0}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Grid: Chart + Suggested Books */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Monthly Spending Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
<<<<<<< HEAD
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Pengeluaran Bulanan
                            </h2>
=======
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pengeluaran Bulanan</h2>
>>>>>>> f973aa1 (fix(bokklist): redesign booklist)
                        </div>
                        {loading ? (
                            <div className="h-64 flex items-center justify-center">
                                <p className="text-gray-500">Memuat chart...</p>
                            </div>
                        ) : data.monthly_spending.length > 0 ? (
                            <div className="h-64">
                                <Bar options={chartOptions} data={chartData} />
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                Belum ada data pengeluaran.
                            </p>
                        )}
                    </div>

                    {/* Suggested Books */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Rekomendasi Buku
                                </h2>
                            </div>
                            <button
                                onClick={() => navigate("/user/book-list")}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Lihat Semua
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {(loading
                                ? Array.from({ length: 4 })
                                : data.suggested_books.slice(0, 4)
                            ).map((book, index) => (
                                <div
                                    key={book?.id || index}
                                    className="text-center"
                                >
                                    <img
                                        src={
                                            loading
                                                ? "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
                                                : book.image_url ||
                                                  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
                                        }
                                        alt={book?.title || "Loading..."}
                                        className="w-full h-32 object-cover rounded-lg mb-2 bg-gray-200"
                                    />
                                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                                        {loading ? "Memuat..." : book.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        {loading ? "" : book.author}
                                    </p>
                                    <p className="text-sm font-bold text-green-600">
                                        {loading
                                            ? "Rp 0"
                                            : `Rp ${book.price.toLocaleString(
                                                  "id-ID"
                                              )}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                {data.recent_orders && data.recent_orders.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Package className="w-5 h-5 text-blue-600" />
<<<<<<< HEAD
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Pesanan Terbaru
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {data.recent_orders.slice(0, 3).map((order) => (
                                <div
                                    key={order.id}
                                    className="flex justify-between items-center p-4 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {order.orderItems &&
                                            order.orderItems.length > 0
                                                ? order.orderItems[0].book
                                                      ?.title || "Tanpa Judul"
                                                : "Tidak ada buku"}
                                        </p>
                                        <p
                                            className={`text-sm font-medium ${
                                                order.status === "completed"
                                                    ? "text-green-600"
                                                    : order.status === "shipped"
                                                    ? "text-blue-600"
                                                    : order.status === "pending"
                                                    ? "text-yellow-600"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {order.status?.toUpperCase() ||
                                                "STATUS TIDAK DIKETAHUI"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/user/order-detail/${order.id}`
                                            )
                                        }
=======
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pesanan Terbaru</h2>
                        </div>
                        <div className="space-y-4">
                            {data.recent_orders.slice(0, 3).map((order) => (
                                <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">Order #{order.id}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {order.orderItems?.length || 0} item(s) - {order.status.toUpperCase()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/user/order-detail/${order.id}`)}
>>>>>>> f973aa1 (fix(bokklist): redesign booklist)
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Lihat Detail
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => navigate("/user/orders")}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Lihat Semua Pesanan
                            </button>
                        </div>
                    </div>
                )}

                {/* Popular Books */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Buku Favorit Anda
                            </h2>
                        </div>
                    </div>
                    {loading || data.popular_books.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {(loading
                                ? Array.from({ length: 5 })
                                : data.popular_books
                            ).map((book, index) => (
                                <div
                                    key={book?.id || index}
                                    className="text-center"
                                >
                                    <img
                                        src={
                                            loading
                                                ? "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
                                                : book.image_url ||
                                                  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
                                        }
                                        alt={book?.title || "Loading..."}
                                        className="w-full h-32 object-cover rounded-lg mb-2 bg-gray-200"
                                    />
                                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                                        {loading ? "Memuat..." : book.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        {loading
                                            ? ""
                                            : `Dibeli ${book.total_purchased}x`}
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
