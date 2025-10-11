import React from "react";
import { Link } from "react-router-dom";

export default function SidebarUser({ darkMode }) {
  return (
    <div className="w-64 min-h-screen bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
        User Dashboard
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link
          to="/dashboard"
          className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
        >
          Home
        </Link>
        <Link
          to="/orders"
          className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
        >
          My Orders
        </Link>
        <Link
          to="/profile"
          className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
        >
          Profile
        </Link>
      </nav>
    </div>
  );
}
