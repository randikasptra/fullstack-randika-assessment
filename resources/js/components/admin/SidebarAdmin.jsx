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
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleMenu = (menu) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const menuItems = [
        {
            path: "/admin/dashboard",
            name: "Dashboard",
            icon: <FaHome className="text-lg" />,
<<<<<<< HEAD
            badge: null,
=======
            badge: null
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
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
<<<<<<< HEAD
            ],
=======
            ]
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
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
<<<<<<< HEAD
=======
                    badge: "5"
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
                },
                {
                    path: "/admin/history-transaction",
                    name: "Riwayat Transaksi",
                    icon: <FaMoneyBillWave className="text-sm" />,
                },
<<<<<<< HEAD
            ],
=======
            ]
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
        },
        {
            path: "/admin/users-manager",
            name: "Manajemen User",
            icon: <FaUsers className="text-lg" />,
<<<<<<< HEAD
=======
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
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
        },
        // {
        //     path: "/admin/reports",
        //     name: "Laporan & Analitik",
        //     icon: <FaChartLine className="text-lg" />,
        // },
        // {
        //     path: "/admin/notifications",
        //     name: "Notifikasi",
        //     icon: <FaBell className="text-lg" />,
        //     badge: "3"
        // },
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
<<<<<<< HEAD
                        {/* Ikon buku menggantikan emoji */}
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
=======
                        <span className="text-white font-bold text-lg">📚</span>
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            MouraBook
                        </h2>
<<<<<<< HEAD
                        <p className="text-xs text-slate-400 mt-0.5">
                            Admin Dashboard
                        </p>
=======
                        <p className="text-xs text-slate-400 mt-0.5">Admin Dashboard</p>
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
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
<<<<<<< HEAD
                                            {expandedMenus[item.key] ? (
                                                <FaChevronDown />
                                            ) : (
                                                <FaChevronRight />
                                            )}
=======
                                            {expandedMenus[item.key] ? <FaChevronDown /> : <FaChevronRight />}
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
                                        </span>
                                    </button>

                                    {expandedMenus[item.key] && (
                                        <ul className="ml-6 mt-1 space-y-1 border-l border-slate-700/50 py-1">
                                            {item.children.map((child) => (
                                                <li key={child.path}>
                                                    <Link
                                                        to={child.path}
                                                        className={`flex items-center justify-between p-2.5 rounded-lg text-sm transition-all duration-200 group ml-3 ${
<<<<<<< HEAD
                                                            location.pathname ===
                                                            child.path
=======
                                                            location.pathname === child.path
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
                                                                ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border-l-2 border-purple-400"
                                                                : "hover:bg-slate-700/30 text-slate-300 hover:text-white"
                                                        }`}
                                                    >
                                                        <div className="flex items-center">
<<<<<<< HEAD
                                                            <span
                                                                className={`mr-3 ${
                                                                    location.pathname ===
                                                                    child.path
                                                                        ? "text-purple-300"
                                                                        : "text-slate-400 group-hover:text-slate-200"
                                                                }`}
                                                            >
                                                                {child.icon}
                                                            </span>
                                                            <span className="font-medium">
                                                                {child.name}
                                                            </span>
=======
                                                            <span className={`mr-3 ${
                                                                location.pathname === child.path
                                                                    ? "text-purple-300"
                                                                    : "text-slate-400 group-hover:text-slate-200"
                                                            }`}>
                                                                {child.icon}
                                                            </span>
                                                            <span className="font-medium">{child.name}</span>
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
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
<<<<<<< HEAD
                                        <span
                                            className={`mr-3 ${
                                                location.pathname === item.path
                                                    ? "text-purple-300"
                                                    : "text-slate-300 group-hover:text-white"
                                            }`}
                                        >
                                            {item.icon}
                                        </span>
                                        <span
                                            className={`text-sm font-medium ${
                                                location.pathname === item.path
                                                    ? "text-white"
                                                    : "text-slate-200 group-hover:text-white"
                                            }`}
                                        >
=======
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
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
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
<<<<<<< HEAD
                    <p className="text-xs text-slate-500">
                        MouraBook Store v1.0
                    </p>
=======
                    <p className="text-xs text-slate-500">MouraBook Store v1.0</p>
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
                </div>
            </div>
        </div>
    );
};

export default SidebarAdmin;
