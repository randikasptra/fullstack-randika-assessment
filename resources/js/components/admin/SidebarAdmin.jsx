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
            await logoutUser(navigate);
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

    const menuItems = [
        {
            path: "/admin/dashboard",
            name: "Dashboard",
            icon: <FaHome className="text-lg" />,
            badge: null
        },
        {
            name: "Produk & Inventory",
            icon: <FaBook className="text-lg" />,
            isParent: true,
            key: "products",
            children: [
                {
                    path: "/admin/books-manager",
                    name: "Kelola Buku",
                    icon: <FaBook className="text-sm" />,
                },
                {
                    path: "/admin/category-manager",
                    name: "Kelola Kategori",
                    icon: <FaTags className="text-sm" />,
                },
            ]
        },
        {
            name: "Pesanan & Transaksi",
            icon: <FaShoppingCart className="text-lg" />,
            isParent: true,
            key: "orders",
            children: [
                {
                    path: "/admin/orders-list",
                    name: "Kelola Pesanan",
                    icon: <FaClipboardList className="text-sm" />,
                    badge: "5"
                },
                {
                    path: "/admin/history-transaction",
                    name: "Riwayat Transaksi",
                    icon: <FaMoneyBillWave className="text-sm" />,
                },
            ]
        },
        {
            path: "/admin/users-manager",
            name: "Manajemen User",
            icon: <FaUsers className="text-lg" />,
        },
        {
            path: "/admin/reports",
            name: "Laporan & Analitik",
            icon: <FaChartLine className="text-lg" />,
        },
        {
            path: "/admin/notifications",
            name: "Notifikasi",
            icon: <FaBell className="text-lg" />,
            badge: "3"
        },
        {
            path: "/admin/settings-admin",
            name: "Pengaturan",
            icon: <FaCog className="text-lg" />,
        },
    ];

    return (
        <div className="fixed top-0 left-0 bg-gradient-to-b from-slate-900 to-slate-800 text-white w-64 h-full flex flex-col justify-between overflow-y-auto shadow-2xl border-r border-slate-700/50">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">📚</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            MouraBook
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">Admin Dashboard</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-4">
                <ul className="space-y-1">
                    {menuItems.map((item, index) => (
                        <li key={index} className="mb-1">
                            {item.isParent ? (
                                <>
                                    <button
                                        onClick={() => toggleMenu(item.key)}
                                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group border border-transparent hover:border-slate-600/30"
                                    >
                                        <div className="flex items-center">
                                            <span className="mr-3 text-slate-300 group-hover:text-white transition-colors">
                                                {item.icon}
                                            </span>
                                            <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="text-slate-400 text-xs transition-transform duration-200">
                                            {expandedMenus[item.key] ? <FaChevronDown /> : <FaChevronRight />}
                                        </span>
                                    </button>

                                    {expandedMenus[item.key] && (
                                        <ul className="ml-6 mt-1 space-y-1 border-l border-slate-700/50 py-1">
                                            {item.children.map((child) => (
                                                <li key={child.path}>
                                                    <Link
                                                        to={child.path}
                                                        className={`flex items-center justify-between p-2.5 rounded-lg text-sm transition-all duration-200 group ml-3 ${
                                                            location.pathname === child.path
                                                                ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border-l-2 border-purple-400"
                                                                : "hover:bg-slate-700/30 text-slate-300 hover:text-white"
                                                        }`}
                                                    >
                                                        <div className="flex items-center">
                                                            <span className={`mr-3 ${
                                                                location.pathname === child.path
                                                                    ? "text-purple-300"
                                                                    : "text-slate-400 group-hover:text-slate-200"
                                                            }`}>
                                                                {child.icon}
                                                            </span>
                                                            <span className="font-medium">{child.name}</span>
                                                        </div>
                                                        {child.badge && (
                                                            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center shadow-lg">
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
                                    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group border ${
                                        location.pathname === item.path
                                            ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border-purple-500/30 shadow-lg"
                                            : "border-transparent hover:border-slate-600/30 hover:bg-slate-700/50"
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <span className={`mr-3 ${
                                            location.pathname === item.path
                                                ? "text-purple-300"
                                                : "text-slate-300 group-hover:text-white"
                                        }`}>
                                            {item.icon}
                                        </span>
                                        <span className={`text-sm font-medium ${
                                            location.pathname === item.path
                                                ? "text-white"
                                                : "text-slate-200 group-hover:text-white"
                                        }`}>
                                            {item.name}
                                        </span>
                                    </div>
                                    {item.badge && (
                                        <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center shadow-lg">
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
            <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                <button
                    onClick={handleLogout}
                    disabled={loading}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-xl shadow-lg transition-all duration-200 font-medium ${
                        loading
                            ? "bg-slate-600 cursor-not-allowed text-slate-400"
                            : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white hover:shadow-xl transform hover:scale-[1.02]"
                    }`}
                >
                    <FaSignOutAlt className="mr-2" />
                    {loading ? "Logging out..." : "Logout"}
                </button>
                <div className="mt-3 text-center">
                    <p className="text-xs text-slate-500">MouraBook Store v1.0</p>
                </div>
            </div>
        </div>
    );
};

export default SidebarAdmin;
