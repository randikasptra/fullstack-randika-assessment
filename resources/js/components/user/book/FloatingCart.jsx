import React from "react";
import PropTypes from "prop-types";
import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";

const FloatingCart = ({ cartItems, onUpdateQuantity, onRemove, onViewCart, onCheckout, totalItems, totalPrice, visible, onClose }) => (
    visible && cartItems.length > 0 ? (
        <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40 max-h-96 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900 dark:text-white">Keranjang ({totalItems})</h3>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Tutup keranjang"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-48">
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl"
                    >
                        <img
                            src={item.book?.image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"}
                            alt={item.book?.title}
                            className="w-12 h-12 object-cover rounded-lg"
                            loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                {item.book?.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.book?.price)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded flex items-center justify-center"
                                aria-label="Kurangi jumlah"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-900 dark:text-white text-sm">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded flex items-center justify-center"
                                disabled={item.quantity >= item.book?.stock}
                                aria-label="Tambah jumlah"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => onRemove(item.id)}
                                className="ml-1 text-red-500 hover:text-red-700 p-1"
                                aria-label="Hapus dari keranjang"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Total:
                    </span>
                    <span className="text-lg font-bold text-green-700 dark:text-green-500">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalPrice)}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onViewCart}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition font-semibold"
                    >
                        Lihat Detail
                    </button>
                    <button
                        onClick={onCheckout}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition font-semibold"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    ) : null
);

FloatingCart.propTypes = {
    cartItems: PropTypes.array.isRequired,
    onUpdateQuantity: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onViewCart: PropTypes.func.isRequired,
    onCheckout: PropTypes.func.isRequired,
    totalItems: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default FloatingCart;
