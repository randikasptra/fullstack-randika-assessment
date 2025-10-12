import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaUsers,
    FaBook,
    FaTags,
    FaMoneyBillWave,
    FaSignOutAlt,
} from "react-icons/fa";
import { logoutUser } from "../../utils/logout";

const SidebarAdmin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await logoutUser(navigate);
        setLoading(false);
    };

    const menuItems = [
        { path: "/admin/dashboard", name: "Dashboard", icon: <FaHome /> },
        {
            path: "/admin/users-manager",
            name: "Manajemen User",
            icon: <FaUsers />,
        },
        {
            path: "/admin/category-manager",
            name: "Manajemen Category",
            icon: <FaTags />,
        }, // 🏷️ diganti dari FaBook ke FaTags
        {
            path: "/admin/book-manager",
            name: "Manajemen Buku",
            icon: <FaBook />,
        }, // 📚 tambahan baru
        {
            path: "/admin/sales",
            name: "Manajemen Penjualan",
            icon: <FaMoneyBillWave />,
        },
    ];

    return (
        <div className="fixed top-0 left-0 bg-gray-800 text-white w-64 h-full p-4 flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path} className="mb-2">
                            <Link
                                to={item.path}
                                className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                                    location.pathname === item.path
                                        ? "bg-gray-700"
                                        : "hover:bg-gray-700"
                                }`}
                            >
                                <span className="mr-3 text-lg">
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={handleLogout}
                disabled={loading}
                className={`flex items-center px-4 py-2 rounded shadow transition mt-4 ${
                    loading
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                }`}
            >
                <FaSignOutAlt className="mr-2" />
                {loading ? "Logging out..." : "Logout"}
            </button>
        </div>
    );
};

export default SidebarAdmin;
