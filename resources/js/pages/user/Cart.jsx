import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingCart, CreditCard, CheckSquare } from "lucide-react";
import cartService from "../../services/user/cartService";
import UserLayout from "../../layouts/UserLayout";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set()); // Set of cartItem IDs yang dipilih
    const [selectAll, setSelectAll] = useState(false);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        // Update total berdasarkan selected items
        const selectedTotal = cartItems
            .filter(item => selectedItems.has(item.id))
            .reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
        setTotal(selectedTotal);

        // Update select all checkbox
        setSelectAll(selectedItems.size === cartItems.length && cartItems.length > 0);
    }, [cartItems, selectedItems]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await cartService.index();
            setCartItems(response.data || []);
            setTotal(response.total || 0);
        } catch (error) {
            console.error("Error fetching cart:", error);
            alert(error.message || "Gagal memuat keranjang");
        } finally {
            setLoading(false);
        }
    };

    const toggleItemSelection = (cartItemId) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(cartItemId)) {
            newSelected.delete(cartItemId);
        } else {
            newSelected.add(cartItemId);
        }
        setSelectedItems(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(cartItems.map(item => item.id)));
        }
    };

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await cartService.update(cartItemId, newQuantity);
            if (response.success) {
                fetchCart(); // Refresh cart
            }
        } catch (error) {
            alert(error.message || "Gagal update keranjang");
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        if (!confirm("Yakin ingin hapus item ini?")) return;

        try {
            const response = await cartService.destroy(cartItemId);
            if (response.success) {
                fetchCart(); // Refresh cart
            }
        } catch (error) {
            alert(error.message || "Gagal hapus item");
        }
    };

    const handleClearCart = async () => {
        if (!confirm("Yakin ingin kosongkan seluruh keranjang?")) return;

        try {
            const response = await cartService.clear();
            if (response.success) {
                fetchCart(); // Refresh cart
            }
        } catch (error) {
            alert(error.message || "Gagal kosongkan keranjang");
        }
    };

    const handleCheckout = () => {
        const selected = cartItems.filter(item => selectedItems.has(item.id));
        if (selected.length === 0) {
            alert("Pilih minimal satu item untuk checkout!");
            return;
        }
        // Pass selected items ke checkout via state
        navigate("/user/checkout", {
            state: {
                fromCart: true,
                selectedCartItems: selected,
                total: total,
            },
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <UserLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Keranjang Belanja ({cartItems.length} item)
                        </h1>
                    </div>
                    {cartItems.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                        >
                            Kosongkan Keranjang
                        </button>
                    )}
                </div>

                {/* Cart Items */}
                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Keranjang Kosong
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Belum ada item di keranjang
                        </p>
                        <button
                            onClick={() => navigate("/user/book-list")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                        >
                            Lanjut Belanja
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-start gap-4"
                                >
                                    {/* Checkbox */}
                                    <div className="flex-shrink-0 mt-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.has(item.id)}
                                            onChange={() => toggleItemSelection(item.id)}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                    </div>

                                    <img
                                        src={
                                            item.book.image_url ||
                                            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
                                        }
                                        alt={item.book.title}
                                        className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                                            {item.book.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {item.book.author || "Tidak diketahui"}
                                        </p>
                                        <p className="text-lg font-bold text-green-700 mb-3">
                                            Rp {item.book.price.toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 text-gray-500 hover:text-gray-700"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 text-gray-500 hover:text-gray-700"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="p-2 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-auto">
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            Rp {(item.book.price * item.quantity).toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Select All & Total & Checkout */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Pilih Semua ({selectedItems.size}/{cartItems.length})
                                    </label>
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    Total: Rp {total.toLocaleString("id-ID")}
                                </span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={selectedItems.size === 0}
                                className="w-full disabled:bg-gray-400 bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed text-white py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2"
                            >
                                <CreditCard className="w-5 h-5" />
                                Lanjut Checkout ({selectedItems.size} item)
                            </button>
                        </div>
                    </>
                )}
            </div>
        </UserLayout>
    );
}
