import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { XCircle, CheckCircle } from "lucide-react";
import transactionService from "../../services/admin/transactionService";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await transactionService.getTransactions();
      if (res && Array.isArray(res.data)) {
        setTransactions(res.data);
        setError(null);
      } else {
        console.warn("Unexpected API response format:", res);
        setError("Format respons dari server tidak sesuai.");
        setTransactions([]);
      }
    } catch (err) {
      console.error("Failed to load transactions:", {
        message: err.message,
        response: err.response ? {
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers,
        } : null,
      });

      let errorMessage = "Gagal memuat transaksi. Silakan coba lagi.";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Sesi tidak valid. Silakan login kembali.";
        } else if (err.response.status === 404) {
          errorMessage = "Endpoint tidak ditemukan. Periksa konfigurasi server.";
        } else if (err.response.data && typeof err.response.data === "string" && err.response.data.includes("<!DOCTYPE html>")) {
          errorMessage = "Menerima respons HTML dari server. Pastikan backend berjalan dengan benar.";
        }
      } else if (err.request) {
        errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi backend.";
      }
      setError(errorMessage);
      setTransactions([]);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Hapus transaksi ini? Tindakan tidak bisa dibatalkan.")) return;

    try {
      setDeletingId(transactionId);
      const response = await transactionService.deleteTransaction(transactionId);
      if (response.success) {
        alert("Transaksi berhasil dihapus");
        fetchTransactions();
      }
    } catch (error) {
      alert(error.message || "Gagal hapus transaksi");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });

  const getStatusBadge = (status) => {
    const badges = {
      completed: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Completed",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Cancelled",
      },
    };
    const badge = badges[status] || badges.cancelled;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Riwayat Transaksi</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat Pengiriman</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(transactions) && transactions.length > 0 ? (
                  transactions.map((trx, index) => (
                    <tr key={trx.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{trx.user?.name || "N/A"}</div>
                        <div className="text-sm text-gray-500">{trx.user?.email || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trx.created_at ? formatDate(trx.created_at) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(trx.total_price || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(trx.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {trx.shippingAddress ? (
                          <div className="max-w-32 truncate">
                            {trx.shippingAddress.address}, {trx.shippingAddress.city}, {trx.shippingAddress.postal_code}
                          </div>
                        ) : (
                          <span className="text-gray-500">No address</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/transactions/${trx.id}`}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            Detail
                          </Link>
                          {trx.status === "cancelled" && (
                            <button
                              onClick={() => handleDeleteTransaction(trx.id)}
                              disabled={deletingId === trx.id}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              {deletingId === trx.id ? "Deleting..." : "Delete"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      Tidak ada transaksi ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
