import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function NavbarUser({ darkMode, user }) {
    const navigate = useNavigate();
    const location = useLocation();


    const handleLogout = async () => {
        const token = localStorage.getItem("auth_token");

        if (!token) {
            toast.warn("Kamu belum login!");
            navigate("/");
            return;
        }

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");

            toast.success("Logout berhasil 👋");
            navigate("/");
        } catch (error) {
            console.error("Logout gagal:", error);
            toast.error("Gagal logout. Silakan coba lagi.");
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Brand */}
                    <div className="flex items-center">
                        <Link
                            to="/user/book-list"
                            className="text-xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            📚 BookStore
                        </Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex space-x-8">
                                {[
                                    { path: "/user/book-list", label: "Belanja Buku" },
                                    { path: "/user/dashboard", label: "Dashboard" },
                                    { path: "/user/orders", label: "Pesanan Saya" },
                                    { path: "/user/library", label: "Koleksi" },
                                    { path: "/user/profile", label: "Profil" },
                                ].map(({ path, label }) => (
                                    <Link
                                        key={path}
                                        to={path}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            isActive(path)
                                                ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => window.dispatchEvent(new Event("toggleDarkMode"))}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <span className="text-yellow-500 text-sm">☀️</span>
                            ) : (
                                <span className="text-gray-600 text-sm">🌙</span>
                            )}
                        </button>

                        {/* User Info */}
                        {user && (
                            <div className="hidden sm:flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <div className="hidden lg:block">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {user.name}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <span>🚪</span>
                            <span className="hidden sm:inline">Logout</span>
                        </button>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                type="button"
                                className="bg-gray-100 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                onClick={() =>
                                    document
                                        .getElementById("mobile-menu")
                                        .classList.toggle("hidden")
                                }
                            >
                                <span>☰</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className="hidden md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
                id="mobile-menu"
            >
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {[
                        { path: "/user/book-list", label: "Belanja Buku" },
                        { path: "/user/dashboard", label: "Dashboard" },
                        { path: "/user/orders", label: "Pesanan Saya" },
                        { path: "/user/wishlist", label: "Wishlist" },
                        { path: "/user/library", label: "Koleksi" },
                        { path: "/user/profile", label: "Profil" },
                    ].map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActive(path)
                                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
