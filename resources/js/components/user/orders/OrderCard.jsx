import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, Truck } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ProgressSteps from "./ProgressSteps";
import ActionButtons from "./ActionButtons";

export default function OrderCard({ order, onCancelOrder, onConfirmOrder, onDeleteOrder, actionLoading }) {
  const navigate = useNavigate();

  const orderItems = order.order_items || order.orderItems || [];
  const shippingAddress = order.shipping_address || order.shippingAddress;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-sm text-gray-600">
          <div className="font-medium text-gray-900">
            Pesanan •{" "}
            {new Date(order.order_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="text-xs mt-1">{orderItems.length} item</div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={order.status} />
          <button
            onClick={() => navigate(`/user/orders/${order.id}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Detail
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress */}
      {["pending", "processing", "paid", "shipped", "completed"].includes(order.status) && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <ProgressSteps status={order.status} />
        </div>
      )}

      {/* Items */}
      <div className="p-6">
        <div className="space-y-4">
          {orderItems.map((item) => (
            <div key={item.id} className="flex gap-4 items-start">
              <img
                src={item.book?.image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"}
                alt={item.book?.title}
                className="w-16 h-20 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {item.book?.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{item.book?.author}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × Rp {item.price?.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Alamat */}
        {shippingAddress && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Alamat Pengiriman
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium">
                {shippingAddress.recipient_name} • {shippingAddress.phone}
              </p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postal_code}
              </p>
            </div>
          </div>
        )}

        {/* Total + Action */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-6 border-t border-gray-100 mt-6">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
            <p className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(order.total_price)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/user/orders/${order.id}`)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium transition-all"
            >
              <Eye className="w-4 h-4" />
              Detail Pesanan
            </button>
            <ActionButtons
              order={order}
              onCancel={onCancelOrder}
              onConfirm={onConfirmOrder}
              onDelete={onDeleteOrder}
              actionLoading={actionLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
