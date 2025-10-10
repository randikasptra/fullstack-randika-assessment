import React from "react";

export default function DashboardUser() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Dashboard User</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p>Selamat datang di halaman katalog 📚</p>
        <p className="text-gray-600 mt-2">
          Di sini kamu bisa melihat daftar buku dan melakukan peminjaman.
        </p>
      </div>
    </div>
  );
}
