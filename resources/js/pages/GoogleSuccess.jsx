import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function GoogleSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get("token");

        if (!token) {
            token = localStorage.getItem("auth_token");
        }

        console.log("🔑 Token dari URL/localStorage:", token);

        if (token) {
            if (window.history.replaceState) {
                window.history.replaceState(null, "", window.location.pathname);
            }

            localStorage.setItem("auth_token", token);
            console.log("✅ Token disimpan ke localStorage:", token);

            axios
                .get("http://127.0.0.1:8000/api/user", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    // console.log("👤 Data user dari API:", res.data);
                    const userData = res.data;

                    localStorage.setItem("user", JSON.stringify(userData));
                    toast.success(
                        `Login berhasil! Selamat datang, ${userData.name}. 🎉`
                    );

                    if (userData.email === "admin@mail.com") {
                        navigate("/admin/dashboard");
                    } else {
                        navigate("/user/dashboard");
                    }
                })
                .catch((error) => {
                    console.error("❌ Gagal verifikasi data user:", error);
                    toast.error(
                        "Gagal mendapatkan data user. Silakan coba login lagi."
                    );
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user");
                    navigate("/");
                });
        } else {
            console.warn(
                "⚠️ Token otentikasi tidak ditemukan di URL maupun localStorage."
            );
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
