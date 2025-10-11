import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
    FaHome,
    FaUsers,
    FaBook,
    FaMoneyBillWave,
    FaSignOutAlt
} from "react-icons/fa";

const SidebarAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const menuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <FaHome /> },
    { path: "/admin/users", name: "Manajemen User", icon: <FaUsers /> },
    { path: "/admin/category", name: "Manajemen Category", icon: <FaBook /> },
    { path: "/admin/sales", name: "Manajemen Penjualan", icon: <FaMoneyBillWave /> },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded shadow transition mt-4"
      >
        <FaSignOutAlt className="mr-2" />
        Logout
      </button>
    </div>
  );
};

export default SidebarAdmin;
