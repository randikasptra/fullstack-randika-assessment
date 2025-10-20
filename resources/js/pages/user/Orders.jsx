import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Icons & Components
import {
  Package,
  Home,
  CheckCircle,
  Clock,
  CreditCard,
  Truck,
  XCircle,
  Trash2,
} from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import OrderCard from "../../components/user/orders/OrderCard";
import LoadingSpinner from "../../components/user/LoadingSpinner";

// Services & Hooks
import orderService from "../../services/user/orderService";
import { useOrderActions } from "../../services/user/useOrderActions";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { handleCancelOrder, handleConfirmOrder, handleDeleteOrder } = useOrderActions();

  // Ambil data pesanan
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders({ page: 1, per_page: 50 });
      setOrders(response.data || []);
    } catch (error) {
      toast.error(error.message || "Gagal memuat pesanan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Handler aksi
  const onCancelOrder = useCallback(
    async (orderId) => {
      if (!window.confirm("Yakin batalkan pesanan ini? Stok akan dikembalikan.")) return;
      const result = await handleCancelOrder(orderId);
      if (result?.success) {
        toast.success("Pesanan dibatalkan!");
        fetchOrders();
      }
    },
    [handleCancelOrder, fetchOrders]
  );

  const onConfirmOrder = useCallback(
    async (orderId) => {
      if (!window.confirm("Yakin pesanan sudah diterima?")) return;
      const result = await handleConfirmOrder(orderId);
      if (result?.success) {
        toast.success("Pesanan dikonfirmasi!");
        fetchOrders();
      }
    },
    [handleConfirmOrder, fetchOrders]
  );

  const onDeleteOrder = useCallback(
    async (orderId) => {
      if (!window.confirm("Yakin hapus pesanan ini dari riwayat?")) return;
      const result = await handleDeleteOrder(orderId);
      if (result?.success) {
        toast.success("Pesanan dihapus!");
        fetchOrders();
      }
    },
    [handleDeleteOrder, fetchOrders]
  );

  // Filter & count tab
  const { filteredOrders, tabCounts } = useMemo(() => {
    const filtered = orders.filter((order) => {
      const statusMap = {
        all: true,
        pending: order.status === "pending",
        processing: order.status === "processing",
        paid: order.status === "paid",
        shipped: order.status === "shipped",
        completed: order.status === "completed",
        cancelled: ["cancelled", "expired"].includes(order.status),
      };
      return statusMap[activeTab] ?? true;
    });

    const counts = {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      paid: orders.filter((o) => o.status === "paid").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => ["cancelled", "expired"].includes(o.status)).length,
    };

    return { filteredOrders: filtered, tabCounts: counts };
  }, [orders, activeTab]);

  // Helpers for badges & progress
  const getStatusBadge = (status) => {
    const map = {
      pending: <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">Menunggu Pembayaran</span>,
      processing: <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Diproses</span>,
      paid: <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">Dibayar</span>,
      shipped: <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">Dikirim</span>,
      completed: <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Selesai</span>,
      cancelled: <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">Dibatalkan</span>,
    };
    return map[status] || <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Tidak Diketahui</span>;
  };

  const getProgressSteps = (status) => {
    const steps = ["pending", "processing", "paid", "shipped", "completed"];
    return (
      <div className="flex justify-between w-full max-w-2xl mx-auto">
        {steps.map((step, idx) => {
          const done = steps.indexOf(status) >= idx;
          return (
            <div key={step} className="flex flex-col items-center text-xs">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {done ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>
              <span className={`mt-2 ${done ? "text-green-600" : "text-gray-400"}`}>
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const getActionButtons = (order) => {
    switch (order.status) {
      case "pending":
        return (
          <button
            onClick={() => onCancelOrder(order.id)}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2 rounded-xl font-medium"
          >
            <XCircle className="w-4 h-4" />
            Batalkan
          </button>
        );
      case "shipped":
        return (
          <button
            onClick={() => onConfirmOrder(order.id)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            Konfirmasi Diterima
          </button>
        );
      case "completed":
      case "cancelled":
        return (
          <button
            onClick={() => onDeleteOrder(order.id)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-2xl shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pesanan Saya</h1>
                <p className="text-gray-600 text-sm">Kelola dan lacak pesanan Anda</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/user/book-list")}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl shadow-lg border border-gray-200 transition-all"
            >
              <Home className="w-5 h-5" />
              Belanja Lagi
            </button>
          </div>

          {/* Tabs */}
          <nav className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-8">
            <div className="flex overflow-x-auto scrollbar-hide">
              {[
                { key: "all", label: "Semua" },
                { key: "pending", label: "Belum Bayar" },
                { key: "processing", label: "Diproses" },
                { key: "paid", label: "Dibayar" },
                { key: "shipped", label: "Dikirim" },
                { key: "completed", label: "Selesai" },
                { key: "cancelled", label: "Dibatalkan" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? "bg-blue-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {tab.label}
                  {tabCounts[tab.key] > 0 && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.key
                          ? "bg-white text-blue-500"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {tabCounts[tab.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Tidak ada pesanan {activeTab === "all" ? "" : activeTab}
              </h2>
              <p className="text-gray-500 mb-6">Mulai belanja dan temukan buku favorit Anda!</p>
              <button
                onClick={() => navigate("/user/book-list")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-medium shadow-lg transition-all"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancelOrder={onCancelOrder}
                  onConfirmOrder={onConfirmOrder}
                  onDeleteOrder={onDeleteOrder}
                  getStatusBadge={getStatusBadge}
                  getProgressSteps={getProgressSteps}
                  getActionButtons={getActionButtons}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
