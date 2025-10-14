import React, { useEffect, useState } from "react";
import transactionService from "../../services/admin/transactionService";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await transactionService.getTransactions();

      // Check if response is valid and contains array data
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

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Riwayat Transaksi</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">#</th>
              <th className="p-2 border">ID Order</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Alamat Pengiriman</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((trx, index) => (
                <tr key={trx.id} className="border-t">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{trx.id}</td>
                  <td className="p-2 border">{trx.user?.name || "-"}</td>
                  <td className="p-2 border">
                    {trx.created_at ? new Date(trx.created_at).toLocaleString() : "-"}
                  </td>
                  <td className="p-2 border">Rp {trx.total_price ?? 0}</td>
                  <td
                    className={`p-2 border font-semibold ${
                      trx.status === "completed" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {trx.status}
                  </td>
                  <td className="p-2 border">
                    {trx.shippingAddress
                      ? `${trx.shippingAddress.address}, ${trx.shippingAddress.city}, ${trx.shippingAddress.postal_code}`
                      : "-"}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={async () => {
                        try {
                          const detail = await transactionService.getTransactionDetail(trx.id);
                          // Display details in a modal or console for now
                          console.log("Transaction Detail:", detail);
                          alert(JSON.stringify(detail.data, null, 2)); // Temporary alert for details
                        } catch (err) {
                          console.error("Failed to fetch detail:", err);
                          alert("Gagal memuat detail transaksi.");
                        }
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Tidak ada transaksi ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
