import React from "react";

export default function DashboardAdmin() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Dashboard Admin</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p>Selamat datang, Admin 👋</p>
        <p className="text-gray-600 mt-2">
          Ini adalah halaman khusus untuk mengelola data katalog buku.
        </p>
      </div>
    </div>
  );
}
