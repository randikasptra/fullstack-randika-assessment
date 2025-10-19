import React from "react";
import PropTypes from "prop-types";
import { Minus, Plus } from "lucide-react";

const QuantityControls = ({ quantity, onDecrease, onIncrease }) => (
    <div className="flex items-center gap-2">
        <button
            onClick={onDecrease}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
            aria-label="Kurangi jumlah"
        >
            <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <button
            onClick={onIncrease}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
            aria-label="Tambah jumlah"
        >
            <Plus className="w-4 h-4" />
        </button>
    </div>
);

QuantityControls.propTypes = {
    quantity: PropTypes.number.isRequired,
    onDecrease: PropTypes.func.isRequired,
    onIncrease: PropTypes.func.isRequired,
};

export default QuantityControls;
