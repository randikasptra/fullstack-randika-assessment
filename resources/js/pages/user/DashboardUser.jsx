import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function DashboardUser() {
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
      >
        Logout
      </button>
    </div>
  );
}
