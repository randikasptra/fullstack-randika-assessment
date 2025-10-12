import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";


export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- 1. REGISTRASI EMAIL MANUAL ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Menggunakan URL lengkap agar konsisten
            await axios.post("http://127.0.0.1:8000/api/register", formData);

            toast.success("Berhasil daftar! Silakan login.");

            // Redirect ke halaman utama/login
            navigate("/");
        } catch (err) {
            // Mengambil pesan error dari response backend
            toast.error(err.response?.data?.message || "Register gagal!");
        }
    };

    // --- 2. REGISTRASI/LOGIN VIA GOOGLE ---
    const handleGoogleLogin = () => {
        // Mengarahkan ke API redirect Laravel (alur Google)
        // window.location.href = "http://127.0.0.1:8000/api/auth/google/redirect";
         window.location.href = `${API_BASE_URL}/api/auth/google/redirect`;
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Daftar Akun Baru
                </h2>

                {/* Form Registrasi Email */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nama Lengkap"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                        Daftar dengan Email
                    </button>
                </form>

                {/* Separator */}
                <div className="flex items-center justify-between my-4">
                    <hr className="w-1/3 border-gray-300" />
                    <span className="text-gray-500 text-sm">atau</span>
                    <hr className="w-1/3 border-gray-300" />
                </div>

                {/* Tombol Google OAuth */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition flex justify-center items-center"
                >
                    <span className="mr-2">🌐</span> Daftar/Login dengan Google
                </button>

                <p className="text-center text-sm mt-3">
                    Sudah punya akun?{" "}
                    <span
                        onClick={() => navigate("/")} // Mengarahkan ke root (asumsi ini halaman login)
                        className="text-green-700 font-semibold cursor-pointer hover:underline"
                    >
                        Login di sini
                    </span>
                </p>
            </div>
        </div>
    );
}
