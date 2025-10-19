import React from "react";
import PropTypes from "prop-types";
import { Trash2 } from "lucide-react";
import QuantityControls from "./QuantityControls";

const CartItem = ({ item, isSelected, onToggleSelection, onUpdateQuantity, onRemove }) => (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-start gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-1">
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelection(item.id)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                id={`cart-${item.id}`}
            />
            <label htmlFor={`cart-${item.id}`} className="sr-only">Pilih item</label>
        </div>

        <img
            src={item.book.image_url || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"}
            alt={item.book.title}
            className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
            loading="lazy"
        />
        <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">{item.book.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.book.author || "Tidak diketahui"}</p>
            <p className="text-lg font-bold text-green-700 mb-3">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.book.price || 0)}
            </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
            <QuantityControls
                quantity={item.quantity}
                onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
                onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
            />
            <button
                onClick={() => onRemove(item.id)}
                className="p-2 text-red-500 hover:text-red-700"
                aria-label="Hapus item"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
        <div className="text-right flex-shrink-0 ml-auto">
            <p className="font-bold text-gray-900 dark:text-white">
                Rp {(item.book.price * item.quantity).toLocaleString("id-ID")}
            </p>
        </div>
    </article>
);

CartItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number,
        quantity: PropTypes.number,
        book: PropTypes.shape({
            title: PropTypes.string,
            author: PropTypes.string,
            price: PropTypes.number,
            image_url: PropTypes.string,
        }),
    }).isRequired,
    isSelected: PropTypes.bool.isRequired,
    onToggleSelection: PropTypes.func.isRequired,
    onUpdateQuantity: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default CartItem;
