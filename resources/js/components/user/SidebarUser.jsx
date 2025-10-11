import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function SidebarUser({ darkMode }) {
    const navigate = useNavigate(); // <-- pastikan ini ada

    const handleLogout = async () => {
        const token = localStorage.getItem("auth_token");

        if (!token) {
            toast.warn("Kamu belum login!");
            navigate("/"); // <-- pakai navigate
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
            navigate("/"); // kembali ke halaman login/home
        } catch (error) {
            console.error("Logout gagal:", error);
            toast.error("Gagal logout. Silakan coba lagi.");
        }
    };

    return (
        <div className="w-64 min-h-screen bg-white dark:bg-gray-800 shadow-lg flex flex-col">
            <div className="p-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
                User Dashboard
            </div>
            <nav className="flex-1 px-4 space-y-2">
                <Link
                    to="/user/dashboard"
                    className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                >
                    Home
                </Link>
                <Link
                    to="/user/book-list"
                    className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                >
                    My Orders
                </Link>
                <Link
                    to="/profile"
                    className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                >
                    Profile
                </Link>
            </nav>

            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow transition"
            >
                Logout
            </button>
        </div>
    );
}
