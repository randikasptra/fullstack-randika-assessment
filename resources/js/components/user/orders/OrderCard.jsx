import React from "react";
import PropTypes from "prop-types";
import { Eye, ArrowRight, Truck } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ProgressSteps from "./ProgressSteps";
import ActionButtons from "./ActionButtons";

const OrderCard = ({ order, onViewDetail, onCancel, onConfirm, onDelete, actionLoading }) => {
    // 🛡️ Cegah render kalau order belum siap
    if (!order || !order.orderItems) {
        return (
            <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-6 text-center text-gray-500">
                Memuat data pesanan...
            </article>
        );
    }

    const handleViewDetail = () => onViewDetail(order.id);

    return (
        <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <header className="p-6 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                            <div className="font-medium text-gray-900">
                                Pesanan •{" "}
                                {order.order_date
                                    ? new Date(order.order_date).toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                      })
                                    : "Tanggal tidak tersedia"}
                            </div>
                            <div className="text-xs mt-1">{order.orderItems?.length || 0} item</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <StatusBadge status={order.status} />
                        <button
                            onClick={handleViewDetail}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            aria-label="Lihat detail pesanan"
                        >
                            Detail
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Progress */}
            {["pending", "processing", "paid", "shipped", "completed"].includes(order.status) && (
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <ProgressSteps status={order.status} />
                </div>
            )}

            {/* Items & Address */}
            <div className="p-6">
                <div className="space-y-4 mb-4">
                    {order.orderItems?.map((item) => (
                        <div key={item.id} className="flex gap-4 items-start">
                            <img
                                src={
                                    item.book?.image_url ||
                                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
                                }
                                alt={item.book?.title || "Buku"}
                                className="w-16 h-20 object-cover rounded-lg shadow-sm"
                                loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                    {item.book?.title || "Judul tidak tersedia"}
                                </h3>
                                <p className="text-sm text-gray-600 mb-1">
                                    {item.book?.author || "Penulis tidak diketahui"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {item.quantity || 0} × Rp{" "}
                                    {item.price?.toLocaleString("id-ID") || 0}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                    Rp{" "}
                                    {(item.price * item.quantity || 0).toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {order.shippingAddress && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Truck className="w-4 h-4" aria-hidden="true" />
                            Alamat Pengiriman
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium">
                                {order.shippingAddress.recipient_name || "Nama tidak tersedia"} •{" "}
                                {order.shippingAddress.phone || "-"}
                            </p>
                            <p>{order.shippingAddress.address || "Alamat tidak tersedia"}</p>
                            <p>
                                {order.shippingAddress.city || ""},{" "}
                                {order.shippingAddress.province || ""}{" "}
                                {order.shippingAddress.postal_code || ""}
                            </p>
                        </div>
                    </div>
                )}

                {/* Total & Actions */}
                <footer className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-6 border-t border-gray-100 mt-6">
                    <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                        <p className="text-2xl font-bold text-green-600">
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                            }).format(order.total_price || 0)}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleViewDetail}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium transition-all"
                            aria-label="Detail pesanan"
                        >
                            <Eye className="w-4 h-4" />
                            Detail Pesanan
                        </button>
                        <ActionButtons
                            order={order}
                            onCancel={onCancel}
                            onConfirm={onConfirm}
                            onDelete={onDelete}
                            actionLoading={actionLoading}
                        />
                    </div>
                </footer>
            </div>
        </article>
    );
};

OrderCard.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.number,
        status: PropTypes.string,
        order_date: PropTypes.string,
        orderItems: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                quantity: PropTypes.number,
                price: PropTypes.number,
                book: PropTypes.shape({
                    title: PropTypes.string,
                    author: PropTypes.string,
                    image_url: PropTypes.string,
                }),
            })
        ),
        shippingAddress: PropTypes.shape({
            recipient_name: PropTypes.string,
            phone: PropTypes.string,
            address: PropTypes.string,
            city: PropTypes.string,
            province: PropTypes.string,
            postal_code: PropTypes.string,
        }),
        total_price: PropTypes.number,
    }),
    onViewDetail: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    actionLoading: PropTypes.bool,
};

export default OrderCard;
