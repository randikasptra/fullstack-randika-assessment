import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SidebarUser from "../../components/user/SidebarUser";

export default function DashboardUser() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

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

    return (
        <div className={`${darkMode ? "dark" : ""} flex min-h-screen`}>
            {/* Sidebar */}
            <SidebarUser darkMode={darkMode} />

            {/* Konten utama */}
            <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Dashboard Admin
                    </h1>
                    <div className="space-x-2">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded shadow hover:brightness-90 transition"
                        >
                            Toggle Dark
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Konten lain */}
                <p className="text-gray-800 dark:text-gray-200">
                    Selamat datang di dashboard user! Pilih menu di sidebar
                    untuk navigasi.
                </p>
            </div>
        </div>
    );
}
