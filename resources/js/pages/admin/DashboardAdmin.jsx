import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SidebarAdmin from "../../components/admin/SidebarAdmin"; // Import komponen sidebar

export default function DashboardAdmin() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warn("Kamu belum login!");
        return;
      }

      // Request logout ke backend
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Hapus data di localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Logout berhasil 👋");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Gagal logout. Coba lagi nanti!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Dashboard Admin
            </h1>
            <p className="text-gray-600">
              Selamat datang di sistem manajemen penjualan buku
            </p>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Statistik Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Total Buku
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Penjualan Hari Ini
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">Rp 5.240.000</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Pelanggan Baru
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Aktivitas Terbaru
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🛒</span>
                    <div>
                      <p className="font-medium">Pembelian baru</p>
                      <p className="text-sm text-gray-600">
                        Buku "React Mastery" terjual
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 jam lalu</span>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">📦</span>
                    <div>
                      <p className="font-medium">Stok diperbarui</p>
                      <p className="text-sm text-gray-600">
                        Buku "JavaScript Basics" restok
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">5 jam lalu</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
