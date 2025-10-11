import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SidebarUser from "../../components/user/SidebarUser";

export default function DashboardUser() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState(null);

    // Ambil data user saat pertama kali load halaman
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
            .then((res) => {
                setUser(res.data);
                // console.log("✅ User data:", res.data);
            })
            .catch((err) => {
                console.error("❌ Gagal memuat user:", err);
                toast.error("Sesi login berakhir. Silakan login ulang.");
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user");
                navigate("/");
            });
    }, [navigate]);



    return (
        <div className={`${darkMode ? "dark" : ""} flex min-h-screen`}>
            {/* Sidebar */}
            <SidebarUser darkMode={darkMode} />

            {/* Konten utama */}
            <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Dashboard User
                    </h1>
                    <div className="space-x-2">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded shadow hover:brightness-90 transition"
                        >
                            Toggle Dark
                        </button>

                    </div>
                </div>

                {/* Selamat datang */}
                <div className="text-gray-800 dark:text-gray-200">
                    {user ? (
                        <p className="text-lg">
                            Selamat datang,{" "}
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {user.name}
                            </span>{" "}
                            🎉
                        </p>
                    ) : (
                        <p className="text-gray-500">Memuat data user...</p>
                    )}
                </div>

                {/* Konten lain */}
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Ini adalah halaman utama dashboard user. Silakan pilih menu di sidebar untuk melanjutkan.
                </p>
            </div>
        </div>
    );
}
