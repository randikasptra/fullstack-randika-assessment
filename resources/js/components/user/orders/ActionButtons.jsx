import React from "react";
import PropTypes from "prop-types";
import { XCircle, CheckCircle, Trash2 } from "lucide-react";

const ActionButtons = ({ order, onCancel, onConfirm, onDelete, actionLoading }) => {
  const navigate = (path) => (window.location.href = path);

  const getActions = () => {
    switch (order.status) {
      case "pending":
      case "processing":
        return (
          <>
            <button
              onClick={() => navigate(`/user/payment/${order.id}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Bayar Sekarang
            </button>
            <button
              onClick={() => onCancel(order.id)}
              disabled={actionLoading}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition-all disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Batalkan
            </button>
          </>
        );
      case "paid":
        return (
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-all">
            Pesanan Diproses
          </button>
        );
      case "shipped":
        return (
          <button
            onClick={() => onConfirm(order.id)}
            disabled={actionLoading}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            Pesanan Diterima
          </button>
        );
      case "completed":
        return (
          <button
            onClick={() => navigate("/user/book-list")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-medium transition-all"
          >
            Pesan Lagi
          </button>
        );
      case "cancelled":
      case "expired":
        return (
          <button
            onClick={() => onDelete(order.id)}
            disabled={actionLoading}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        );
      default:
        return null;
    }
  };

  return <div className="flex flex-wrap gap-3">{getActions()}</div>;
};

ActionButtons.propTypes = {
  order: PropTypes.shape({ status: PropTypes.string, id: PropTypes.number }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  actionLoading: PropTypes.bool,
};

export default ActionButtons;
