import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserLayout from "../../layouts/UserLayout";

export default function DashboardUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [stats] = useState({
    totalOrders: 8,
    pendingOrders: 2,
    completedOrders: 6,
    wishlistItems: 12,
    purchasedBooks: 25,
  });

  const [recentOrders] = useState([
    { id: 1, bookTitle: "The Psychology of Money", date: "2024-01-15", status: "Completed", price: "Rp 89.000" },
    { id: 2, bookTitle: "Atomic Habits", date: "2024-01-10", status: "Processing", price: "Rp 95.000" },
    { id: 3, bookTitle: "Deep Work", date: "2024-01-05", status: "Completed", price: "Rp 78.000" },
  ]);

  const [recommendedBooks] = useState([
    { id: 1, title: "The Midnight Library", author: "Matt Haig", price: "Rp 85.000", rating: 4.5 },
    { id: 2, title: "Project Hail Mary", author: "Andy Weir", price: "Rp 92.000", rating: 4.7 },
    { id: 3, title: "Klara and the Sun", author: "Kazuo Ishiguro", price: "Rp 79.000", rating: 4.3 },
  ]);

  // Toggle dark mode event listener
  useEffect(() => {
    const handleToggleDarkMode = () => setDarkMode((prev) => !prev);
    window.addEventListener("toggleDarkMode", handleToggleDarkMode);
    return () => window.removeEventListener("toggleDarkMode", handleToggleDarkMode);
  }, []);

  // Fetch user
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.warn("Kamu belum login!");
      navigate("/");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        toast.error("Sesi login berakhir. Silakan login ulang.");
        localStorage.removeItem("auth_token");
        navigate("/");
      });
  }, [navigate]);

  return (
    <UserLayout darkMode={darkMode} user={user}>
      <div className={`${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900 min-h-screen`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Saya
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Selamat datang kembali di Toko Buku Online
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              { label: "Total Pesanan", value: stats.totalOrders, color: "blue", icon: "📦" },
              { label: "Pesanan Tertunda", value: stats.pendingOrders, color: "yellow", icon: "⏳" },
              { label: "Pesanan Selesai", value: stats.completedOrders, color: "green", icon: "✅" },
              { label: "Wishlist", value: stats.wishlistItems, color: "purple", icon: "❤️" },
              { label: "Buku Dibeli", value: stats.purchasedBooks, color: "indigo", icon: "📖" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{item.label}</p>
                    <p className={`text-2xl font-bold text-${item.color}-600 dark:text-${item.color}-400 mt-1`}>
                      {item.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg flex items-center justify-center`}
                  >
                    <span className={`text-${item.color}-600 dark:text-${item.color}-400 text-xl`}>{item.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Recent Orders */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pesanan Terbaru
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            B{order.id}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{order.bookTitle}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {order.status}
                          </span>
                          <p className="text-gray-900 dark:text-white font-medium mt-1">{order.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/user/orders")}
                    className="w-full mt-6 py-3 bg-gray-100 dark:bg-gray-750 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                  >
                    Lihat Semua Pesanan
                  </button>
                </div>
              </div>
            </div>

            {/* Right - Recommendations & Actions */}
            <div className="space-y-8">
              {/* Recommended Books */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Rekomendasi Untuk Anda
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {recommendedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg transition-colors"
                    >
                      <div className="w-16 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{book.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gray-900 dark:text-white font-semibold">{book.price}</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{book.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate("/user/book-list")}
                    className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Jelajahi Koleksi Buku
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Akses Cepat
                  </h2>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {[
                    { label: "Profil Saya", icon: "👤", color: "blue", path: "/user/profile" },
                    { label: "Wishlist", icon: "❤️", color: "green", path: "/user/wishlist" },
                    { label: "Koleksi", icon: "📚", color: "purple", path: "/user/library" },
                    { label: "Pengaturan", icon: "⚙️", color: "orange", path: "/user/settings" },
                  ].map((btn, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(btn.path)}
                      className="p-4 bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-center transition-colors"
                    >
                      <div
                        className={`w-10 h-10 bg-${btn.color}-100 dark:bg-${btn.color}-900/30 rounded-lg flex items-center justify-center mx-auto mb-2`}
                      >
                        <span className={`text-${btn.color}-600 dark:text-${btn.color}-400`}>{btn.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {btn.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
