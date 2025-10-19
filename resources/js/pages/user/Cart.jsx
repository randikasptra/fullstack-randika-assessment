import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Ganti alert ke toast

// Icons
import { ShoppingCart, CreditCard } from "lucide-react";

// Components
import UserLayout from "../../layouts/UserLayout";
import CartItem from "../../components/user/cart/CartItem"; // Subfolder
import QuantityControls from "../../components/user/cart/QuantityControls";
import CartSummary from "../../components/user/cart/CartSummary";
import LoadingSpinner from "../../components/user/LoadingSpinner"; // Dari sebelumnya

// Services
import cartService from "../../services/user/cartService";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            const response = await cartService.index();
            setCartItems(response.data || []);
            // Reset selection on refresh
            setSelectedItems(new Set());
        } catch (error) {
            toast.error(error.message || "Gagal memuat keranjang");
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleItemSelection = useCallback((cartItemId) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(cartItemId)) {
                newSet.delete(cartItemId);
            } else {
                newSet.add(cartItemId);
            }
            return newSet;
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        setSelectedItems(prev =>
            prev.size === cartItems.length ? new Set() : new Set(cartItems.map(item => item.id))
        );
    }, [cartItems]);

    const handleUpdateQuantity = useCallback(async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        // Optimistic update
        setCartItems(prev => prev.map(item =>
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        ));
        try {
            const response = await cartService.update(cartItemId, newQuantity);
            if (!response.success) throw new Error('Update failed');
        } catch (error) {
            toast.error(error.message);
            fetchCart(); // Rollback
        }
    }, [fetchCart]);

    const handleRemoveItem = useCallback(async (cartItemId) => {
        if (!window.confirm("Yakin hapus item ini?")) return;
        // Optimistic remove
        setCartItems(prev => prev.filter(item => item.id !== cartItemId));
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(cartItemId);
            return newSet;
        });
        try {
            const response = await cartService.destroy(cartItemId);
            if (!response.success) throw new Error('Remove failed');
        } catch (error) {
            toast.error(error.message);
            fetchCart(); // Rollback
        }
    }, [fetchCart]);

    const handleClearCart = useCallback(async () => {
        if (!window.confirm("Yakin kosongkan keranjang?")) return;
        setCartItems([]);
        setSelectedItems(new Set());
        try {
            const response = await cartService.clear();
            if (!response.success) throw new Error('Clear failed');
        } catch (error) {
            toast.error(error.message);
            fetchCart();
        }
    }, [fetchCart]);

    const handleCheckout = useCallback(() => {
        const selected = cartItems.filter(item => selectedItems.has(item.id));
        if (selected.length === 0) {
            toast.warning("Pilih minimal satu item!");
            return;
        }
        navigate("/user/checkout", {
            state: { fromCart: true, selectedCartItems: selected, total: selected.reduce((sum, item) => sum + item.book.price * item.quantity, 0) },
        });
    }, [cartItems, selectedItems, navigate]);

    // Memoize computed values
    const { selectAll, total } = useMemo(() => {
        const selAll = selectedItems.size === cartItems.length && cartItems.length > 0;
        const tot = cartItems
            .filter(item => selectedItems.has(item.id))
            .reduce((sum, item) => sum + item.book.price * item.quantity, 0);
        return { selectAll: selAll, total: tot };
    }, [cartItems, selectedItems]);

    if (loading) {
        return (
            <UserLayout>
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <LoadingSpinner />
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="w-8 h-8 text-blue-600" aria-hidden="true" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Keranjang Belanja ({cartItems.length} item)
                        </h1>
                    </div>
                    {cartItems.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                            aria-label="Kosongkan keranjang"
                        >
                            Kosongkan Keranjang
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" aria-hidden="true" />
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Keranjang Kosong</h2>
                        <p className="text-gray-500 mb-6">Belum ada item di keranjang</p>
                        <button
                            onClick={() => navigate("/user/book-list")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                        >
                            Lanjut Belanja
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8" role="list">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedItems.has(item.id)}
                                    onToggleSelection={toggleItemSelection}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>

                        <CartSummary
                            selectAll={selectAll}
                            onToggleSelectAll={toggleSelectAll}
                            total={total}
                            selectedCount={selectedItems.size}
                            onCheckout={handleCheckout}
                            disabled={selectedItems.size === 0}
                        />
                    </>
                )}
            </div>
        </UserLayout>
    );
}
