import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function GoogleSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            // Bersihkan URL dari token SEBELUM panggil API, tapi setelah token disimpan
            // Ini bisa menjadi sumber error jika tidak dikontrol dengan baik.
            if (window.history.replaceState) {
                window.history.replaceState(null, "", window.location.pathname);
            }

            localStorage.setItem("auth_token", token);

            // Pastikan URL API BENAR
            axios
                .get("http://127.0.0.1:8000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    const userData = res.data;
                    localStorage.setItem("user", JSON.stringify(userData));
                    toast.success(
                        `Login berhasil! Selamat datang, ${userData.name}. 🎉`
                    );

                    // Logika Redirect
                    if (userData.email === "admin@mail.com") {
                        navigate("/admin/dashboard");
                    } else {
                        navigate("/user/dashboard");
                    }
                })
                .catch((error) => {
                    console.error(
                        "Gagal verifikasi data user (API Error):",
                        error
                    );
                    toast.error(
                        "Gagal mendapatkan data user. Silakan coba login lagi."
                    );

                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user");
                    navigate("/");
                });
        } else {
            toast.error("Token otentikasi tidak ditemukan.");
            navigate("/");
        }
    }, [navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
                <h2 className="text-xl font-bold text-gray-700 mb-3">
                    Otentikasi Google Berhasil
                </h2>
                <p className="text-gray-500 text-sm">
                    Memverifikasi akun dan mengalihkan ke *dashboard*... 🚀
                </p>
            </div>
        </div>
    );
}
