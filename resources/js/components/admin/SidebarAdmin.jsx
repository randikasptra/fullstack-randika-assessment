import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaUsers,
    FaBook,
    FaTags,
    FaShoppingCart,
    FaClipboardList,
    FaMoneyBillWave,
    FaCreditCard,
    FaChartLine,
    FaWarehouse,
    FaBell,
    FaCog,
    FaSignOutAlt,
    FaChevronDown,
    FaChevronRight,
} from "react-icons/fa";
import { logoutUser } from "../../utils/logout";

const SidebarAdmin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({
        products: false,
        orders: false,
    });

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser(navigate);  // Tambah try-catch kalau perlu
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleMenu = (menu) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const menuItems = [  // Pastiin comma di setiap object
        {
            path: "/admin/dashboard",
            name: "Dashboard",
            icon: <FaHome />,
            badge: null
        },
        {
            name: "Produk & Inventory",
            icon: <FaBook />,
            isParent: true,
            key: "products",
            children: [
                {
                    path: "/admin/books-manager",
                    name: "Kelola Buku",
                    icon: <FaBook />,
                },
                {
                    path: "/admin/category-manager",
                    name: "Kelola Kategori",
                    icon: <FaTags />,
                },
                {
                    path: "/admin/inventory",
                    name: "Inventory Tracking",
                    icon: <FaWarehouse />,
                    badge: "New"
                },
            ]
        },
        {
            name: "Pesanan & Transaksi",
            icon: <FaShoppingCart />,
            isParent: true,
            key: "orders",
            children: [
                {
                    path: "/admin/orders-list",
                    name: "Kelola Pesanan",
                    icon: <FaClipboardList />,
                    badge: "5"
                },
                {
                    path: "/admin/transactions",
                    name: "Riwayat Transaksi",
                    icon: <FaMoneyBillWave />,
                },
                {
                    path: "/admin/payments",
                    name: "Payment Gateway",
                    icon: <FaCreditCard />,
                },
            ]
        },
        {
            path: "/admin/users-manager",
            name: "Manajemen User",
            icon: <FaUsers />,
        },
        {
            path: "/admin/reports",
            name: "Laporan & Analitik",
            icon: <FaChartLine />,
        },
        {
            path: "/admin/notifications",
            name: "Notifikasi",
            icon: <FaBell />,
            badge: "3"
        },
        {
            path: "/admin/settings-admin",
            name: "Pengaturan",
            icon: <FaCog />,
        },
    ];

    return (
        <div className="fixed top-0 left-0 bg-gray-800 text-white w-64 h-full flex flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-green-400">📚 BookStore</h2>
                <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-4">
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index} className="mb-1">
                            {item.isParent ? (
                                <>
                                    <button
                                        onClick={() => toggleMenu(item.key)}
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <div className="flex items-center">
                                            <span className="mr-3 text-lg">{item.icon}</span>
                                            <span className="text-sm">{item.name}</span>
                                        </div>
                                        {expandedMenus[item.key] ? <FaChevronDown /> : <FaChevronRight />}
                                    </button>

                                    {expandedMenus[item.key] && (
                                        <ul className="ml-4 mt-1 space-y-1">
                                            {item.children.map((child) => (
                                                <li key={child.path}>
                                                    <Link
                                                        to={child.path}
                                                        className={`flex items-center justify-between p-2 rounded-lg text-sm transition-colors duration-200 ${
                                                            location.pathname === child.path
                                                                ? "bg-green-600 text-white"
                                                                : "hover:bg-gray-700 text-gray-300"
                                                        }`}
                                                    >
                                                        <div className="flex items-center">
                                                            <span className="mr-3">{child.icon}</span>
                                                            <span>{child.name}</span>
                                                        </div>
                                                        {child.badge && (
                                                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                                {child.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-200 ${
                                        location.pathname === item.path
                                            ? "bg-green-600 text-white"
                                            : "hover:bg-gray-700"
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-3 text-lg">{item.icon}</span>
                                        <span className="text-sm">{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer - Logout Button */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    disabled={loading}
                    className={`w-full flex items-center justify-center px-4 py-2 rounded-lg shadow transition ${
                        loading
                            ? "bg-red-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                    <FaSignOutAlt className="mr-2" />
                    {loading ? "Logging out..." : "Logout"}
                </button>
            </div>
        </div>
    );
};

export default SidebarAdmin;  // Ini harus di akhir, tanpa spasi aneh
