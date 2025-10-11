import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function GoogleSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        // 1. Bersihkan URL dari token (Penting!)
        window.history.replaceState(null, '', window.location.pathname);

        if (token) {
            // 2. Simpan token
            localStorage.setItem("auth_token", token);

            // 3. Ambil data user dari backend
            axios
                .get("http://127.0.0.1:8000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    const userData = res.data;
                    localStorage.setItem("user", JSON.stringify(userData));
                    toast.success(`Login berhasil! Selamat datang, ${userData.name}. 🎉`);

                    // 4. LOGIKA REDIRECT LANGSUNG KE DASHBOARD
                    if (userData.email === "admin@mail.com") {
                        navigate("/admin/dashboard");
                    } else {
                        // Semua pengguna non-admin diarahkan ke user dashboard
                        navigate("/user/dashboard");
                    }
                })
                .catch((error) => {
                    console.error("Gagal ambil data user:", error);
                    toast.error("Gagal verifikasi data user. Silakan coba login lagi.");

                    // Jika gagal, hapus token dan kembali ke login
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user");
                    navigate("/"); // Arahkan ke halaman Login/root
                });
        } else {
            toast.error("Token otentikasi tidak ditemukan.");
            navigate("/"); // Arahkan ke halaman Login/root
        }
    }, [navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
                <h2 className="text-xl font-bold text-gray-700 mb-3">
                    Login Berhasil!
                </h2>
                <p className="text-gray-500 text-sm">
                    Kamu akan segera dialihkan ke *dashboard*... 🚀
                </p>
            </div>
        </div>
    );
}
