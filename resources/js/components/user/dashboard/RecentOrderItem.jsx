import React from "react";
import PropTypes from "prop-types";

const RecentOrderItem = ({ order, onView }) => (
    <div className="flex justify-between items-center p-4 border rounded-lg">
        <div>
            <p className="font-semibold text-gray-900 dark:text-white">
                {order.orderItems?.[0]?.book?.title || "Tidak ada buku"}
            </p>
            <p
                className={`text-sm font-medium ${
                    order.status === "completed" ? "text-green-600" :
                    order.status === "shipped" ? "text-blue-600" :
                    order.status === "pending" ? "text-yellow-600" : "text-gray-500"
                }`}
                aria-label={`Status: ${order.status}`}
            >
                {order.status?.toUpperCase() || "STATUS TIDAK DIKETAHUI"}
            </p>
        </div>
        <button
            onClick={onView}
            className="text-blue-600 hover:text-blue-800 text-sm"
            aria-label={`Lihat detail pesanan ${order.id}`}
        >
            Lihat Detail
        </button>
    </div>
);

RecentOrderItem.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.number,
        status: PropTypes.string,
        orderItems: PropTypes.array,
    }).isRequired,
    onView: PropTypes.func.isRequired,
};

export default RecentOrderItem;
