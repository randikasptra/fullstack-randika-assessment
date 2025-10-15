import React, { useState } from "react";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import { Bars3Icon } from "@heroicons/react/24/outline"; // Ikon hamburger untuk mobile

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State untuk kontrol sidebar

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Hamburger Button untuk Mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 lg:hidden transition-all duration-200"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main
        className={`flex-1 p-4 sm:p-6 lg:ml-64 lg:p-8 transition-all duration-300 w-full min-h-screen ${
          sidebarOpen ? "opacity-50 lg:opacity-100 pointer-events-none lg:pointer-events-auto" : ""
        }`}
      >
        {/* Header Spacer untuk Mobile */}
        <div className="h-16 lg:h-0" /> {/* Spacer untuk mencegah konten tertutup hamburger button */}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
