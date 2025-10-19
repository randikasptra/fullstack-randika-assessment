import React from "react";
import PropTypes from "prop-types";
import { CreditCard } from "lucide-react";

const CartSummary = ({ selectAll, onToggleSelectAll, total, selectedCount, onCheckout, disabled }) => (
    <footer className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={onToggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    id="select-all"
                />
                <label htmlFor="select-all" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pilih Semua ({selectedCount} item)
                </label>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
                Total: Rp {total.toLocaleString("id-ID")}
            </span>
        </div>
        <button
            onClick={onCheckout}
            disabled={disabled}
            className="w-full disabled:bg-gray-400 bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed text-white py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2"
            aria-label="Lanjut ke checkout"
        >
            <CreditCard className="w-5 h-5" />
            Lanjut Checkout ({selectedCount} item)
        </button>
    </footer>
);

CartSummary.propTypes = {
    selectAll: PropTypes.bool.isRequired,
    onToggleSelectAll: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    selectedCount: PropTypes.number.isRequired,
    onCheckout: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default CartSummary;
