import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
    BookOpen,
    Mail,
    Lock,
    LogIn,
    UserPlus,
    Eye,
    EyeOff,
    Shield,
    Zap,
    BarChart3,
    AtSign,
    Key,
    AlertTriangle
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // 🔹 Helper untuk simpan token & user
    const saveAuthData = (token, user) => {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user", JSON.stringify(user));
    };

    // ---- Handle token dari Google OAuth ----
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        if (!token) return;

        localStorage.setItem("auth_token", token);

        axios.get(`${API_BASE_URL}/api/user`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            const user = res.data;
            saveAuthData(token, user);
            toast.success(`Login berhasil! Selamat datang, ${user.name}`);
            navigate(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
        })
        .catch((err) => {
            console.error("Error saat ambil data user:", err);
            toast.error("Gagal mendapatkan data user!");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            navigate("/");
        });
    }, [location.search, navigate]);

    // ---- Login manual ----
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/login`, {
                email,
                password,
            });

            saveAuthData(data.token, data.user);
            toast.success(`Login berhasil! Selamat datang, ${data.user.name}`);
            navigate(data.user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
        } catch (err) {
            console.error("Login gagal:", err);
            toast.error(err.response?.data?.message || "Email atau password salah!");
        } finally {
            setLoading(false);
        }
    };

    // ---- Google OAuth ----
    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE_URL}/api/auth/google/redirect`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4 font-['Poppins']">
            <div className="login-container bg-white rounded-2xl w-full max-w-5xl flex flex-col md:flex-row animate-fade-in shadow-2xl">
                {/* Left Section - Information */}
                <div className="info-section text-white p-8 md:p-12 md:w-1/2 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500">
                    <div className="absolute inset-0 opacity-5">
                        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="currentColor"/>
                        </svg>
                    </div>

                    <div className="mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
                        <div className="logo-container mb-6 w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                            <BookOpen className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">MOURABOOK STORE</h1>
                        <p className="text-lg opacity-90">Tempatnya Buku Berkualitas</p>
                    </div>

                    <div className="space-y-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
                        <div className="feature-item flex items-start">
                            <div className="bg-white/20 p-2 rounded-lg mr-4 flex-shrink-0">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Aman & Terpercaya</h3>
                                <p className="opacity-80 text-sm">Transaksi aman dengan sistem terenkripsi</p>
                            </div>
                        </div>

                        <div className="feature-item flex items-start">
                            <div className="bg-white/20 p-2 rounded-lg mr-4 flex-shrink-0">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Cepat & Mudah</h3>
                                <p className="opacity-80 text-sm">Proses belanja buku yang cepat dan sederhana</p>
                            </div>
                        </div>

                        <div className="feature-item flex items-start">
                            <div className="bg-white/20 p-2 rounded-lg mr-4 flex-shrink-0">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Koleksi Lengkap</h3>
                                <p className="opacity-80 text-sm">Ribuan buku dari berbagai genre tersedia</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-white/20 animate-fade-in" style={{animationDelay: '0.6s'}}>
                        <p className="text-sm opacity-80">"Membuka jendela dunia melalui halaman-halaman buku"</p>
                    </div>
                </div>

                {/* Right Section - Login Form */}
                <div className="bg-white p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                    <div className="mb-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Masuk ke Akun Anda</h2>
                        <p className="text-gray-600">Silakan masukkan kredensial Anda untuk mengakses toko</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field w-full pl-12 pr-4 py-3 border border-gray-200/70 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none bg-white/70 backdrop-blur-sm transition-all duration-300"
                                    placeholder="Masukkan email"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <AtSign className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="animate-fade-in" style={{animationDelay: '0.5s'}}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field w-full pl-12 pr-12 py-3 border border-gray-200/70 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none bg-white/70 backdrop-blur-sm transition-all duration-300"
                                    placeholder="Masukkan password"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="w-5 h-5 text-gray-400" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between animate-fade-in" style={{animationDelay: '0.6s'}}>
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                                    Ingat saya
                                </label>
                            </div>
                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                Lupa password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-login w-full text-white font-semibold py-3.5 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in relative overflow-hidden"
                            style={{animationDelay: '0.7s'}}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    <span className="relative z-10">Masuk ke Akun</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6 animate-fade-in" style={{animationDelay: '0.8s'}}>
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">atau</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full border border-gray-300 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md animate-fade-in"
                        style={{animationDelay: '0.9s'}}
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        <span className="text-gray-700 font-medium">Lanjutkan dengan Google</span>
                    </button>

                    {/* Register Link */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-200/30 animate-fade-in" style={{animationDelay: '1s'}}>
                        <p className="text-gray-600">
                            Belum punya akun?{" "}
                            <Link
                                to="/register"
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors flex items-center justify-center space-x-1 inline-flex"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Daftar di sini</span>
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200/30 animate-fade-in" style={{animationDelay: '1.1s'}}>
                        <p className="text-center text-xs text-gray-500">
                            © {new Date().getFullYear()} MouraBook Store. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

                .login-container {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
                    transform: perspective(1000px) rotateX(0deg);
                    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    overflow: hidden;
                }

                .login-container:hover {
                    box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.2);
                    transform: perspective(1000px) rotateX(2deg);
                }

                .animate-fade-in {
                    animation: fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .input-field {
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 10px -5px rgba(0, 0, 0, 0.1);
                }

                .input-field:focus {
                    box-shadow: 0 5px 20px -5px rgba(37, 99, 235, 0.2);
                }

                .btn-login {
                    position: relative;
                    overflow: hidden;
                }

                .btn-login::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -60%;
                    width: 200%;
                    height: 200%;
                    background: rgba(255, 255, 255, 0.2);
                    transform: rotate(30deg);
                    transition: all 0.4s ease;
                }

                .btn-login:hover::after {
                    left: 100%;
                }

                .logo-container {
                    filter: drop-shadow(0 5px 10px rgba(255, 255, 255, 0.2));
                    transition: all 0.5s ease;
                }

                .logo-container:hover {
                    transform: scale(1.05) rotate(-5deg);
                    filter: drop-shadow(0 8px 15px rgba(255, 255, 255, 0.3));
                }

                .feature-item {
                    transition: all 0.3s ease;
                }

                .feature-item:hover {
                    transform: translateX(5px);
                }
            `}</style>
        </div>
    );
}
