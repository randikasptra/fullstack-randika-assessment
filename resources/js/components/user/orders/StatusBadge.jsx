import React from "react";
import PropTypes from "prop-types";
import { Clock, CreditCard, Package2, Truck, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
    const statusConfig = {
        pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock, text: "Belum Bayar" },
        processing: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: CreditCard, text: "Menunggu Pembayaran" },
        paid: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Package2, text: "Sedang Diproses" },
        shipped: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Truck, text: "Sedang Dikirim" },
        completed: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, text: "Selesai" },
        cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, text: "Dibatalkan" },
        expired: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle, text: "Kadaluarsa" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
            <Icon className="w-4 h-4" aria-hidden="true" />
            {config.text}
        </span>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.oneOf(["pending", "processing", "paid", "shipped", "completed", "cancelled", "expired"]),
};

export default StatusBadge;
