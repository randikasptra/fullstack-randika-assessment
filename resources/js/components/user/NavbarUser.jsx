import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiBook
} from "react-icons/fi";

export default function NavbarUser({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const navLinks = [
      { path: "/user/dashboard", label: "Dashboard", icon: <FiHome className="w-4 h-4" /> },
    { path: "/user/book-list", label: "Katalog Buku", icon: <FiBook className="w-4 h-4" /> },
    { path: "/user/cart", label: "Keranjang", icon: <FiShoppingCart className="w-4 h-4" /> },
    { path: "/user/orders", label: "Pesanan Saya", icon: <FiPackage className="w-4 h-4" /> },
    { path: "/user/profile-users", label: "Profile", icon: <FiUser className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/user/book-list"
            className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-400 rounded-lg flex items-center justify-center">
              <FiBook className="w-4 h-4 text-white" />
            </div>
            <span>Moura Store</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 ml-10">
            {navLinks.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border border-purple-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* User Info */}
            {user && (
              <div className="hidden sm:flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-4 py-2 border border-purple-100">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-800">
                    {user.name}
                  </p>
                </div>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="sm:hidden p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden bg-gray-50 hover:bg-gray-100 p-2 rounded-lg text-gray-600 transition-colors border border-gray-200"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive(path)
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border border-purple-100"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
