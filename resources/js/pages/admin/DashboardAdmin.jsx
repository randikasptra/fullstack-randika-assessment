import React from "react";
import AdminLayout from "../../layouts/AdminLayout.jsx"; // Gunakan layout baru

const DashboardAdmin = () => {
  return (
    <AdminLayout>
      {/* Header */}
      <header className="bg-white shadow-sm mb-6">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Dashboard Admin
          </h1>
          <p className="text-gray-600">
            Selamat datang di sistem manajemen penjualan buku
          </p>
        </div>
      </header>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Buku</h3>
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
              <h3 className="text-lg font-semibold text-gray-700">Penjualan Hari Ini</h3>
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
              <h3 className="text-lg font-semibold text-gray-700">Pelanggan Baru</h3>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Aktivitas Terbaru</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg mr-3">🛒</span>
              <div>
                <p className="font-medium">Pembelian baru</p>
                <p className="text-sm text-gray-600">Buku "React Mastery" terjual</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 jam lalu</span>
          </div>

          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg mr-3">📦</span>
              <div>
                <p className="font-medium">Stok diperbarui</p>
                <p className="text-sm text-gray-600">Buku "JavaScript Basics" restok</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">5 jam lalu</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;
