import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
    BookOpen,
    Mail,
    Lock,
    User,
    UserPlus,
    Eye,
    EyeOff,
    Shield,
    LogIn
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- 1. REGISTRASI EMAIL MANUAL ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/api/register`, formData);
            toast.success("Berhasil daftar! Silakan login.");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registrasi gagal!");
        } finally {
            setLoading(false);
        }
    };

    // --- 2. REGISTRASI/LOGIN VIA GOOGLE ---
    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE_URL}/api/auth/google/redirect`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Left Side - Branding */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-500 p-8 lg:p-12 text-white hidden lg:flex flex-col justify-center">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">MouraBook Store</h1>
                            <p className="text-green-100 mt-1">Bergabunglah dengan Komunitas Pembaca</p>
                        </div>
                    </div>

                    <div className="space-y-4 mt-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <UserPlus className="w-4 h-4" />
                            </div>
                            <p className="text-green-100">Daftar mudah dan cepat</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4" />
                            </div>
                            <p className="text-green-100">Keamanan data terjamin</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <p className="text-green-100">Akses ke ribuan buku</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="p-8 lg:p-12">
                    {/* Mobile Branding */}
                    <div className="flex items-center space-x-3 mb-8 lg:hidden">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">MouraBook Store</h1>
                            <p className="text-gray-600 text-sm">Bergabunglah dengan Komunitas Pembaca</p>
                        </div>
                    </div>

                    <div className="max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                Buat Akun Baru
                            </h2>
                            <p className="text-gray-600">
                                Bergabung dengan MouraBook dan temukan dunia buku yang menarik
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <User className="w-4 h-4 mr-2 text-green-500" />
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Masukkan nama lengkap"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Mail className="w-4 h-4 mr-2 text-green-500" />
                                    Alamat Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="masukkan@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Lock className="w-4 h-4 mr-2 text-green-500" />
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Buat password yang kuat"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 ${
                                    loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        <span>Buat Akun Baru</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center my-8">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-4 text-sm text-gray-500">atau</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* Google Login */}
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full border border-gray-300 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            <span className="text-gray-700 font-medium">Lanjutkan dengan Google</span>
                        </button>

                        {/* Login Link */}
                        <div className="text-center mt-8 pt-6 border-t border-gray-200">
                            <p className="text-gray-600">
                                Sudah punya akun?{" "}
                                <Link
                                    to="/"
                                    className="text-green-600 hover:text-green-700 font-semibold transition-colors flex items-center justify-center space-x-1 inline-flex"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Masuk di sini</span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
