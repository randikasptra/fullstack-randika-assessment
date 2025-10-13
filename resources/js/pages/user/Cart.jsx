// resources/js/pages/user/Cart.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NavbarUser from "../../components/user/NavbarUser";
import cartService from '../../services/user/cartService';
import checkoutService from '../../services/user/checkoutService';
import paymentService from '../../services/user/paymentService';
import orderService from '../../services/user/orderService';
import bookService from "../../services/user/bookService";




const Cart = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem("auth_token");

    // Toggle dark mode
    useEffect(() => {
        const handleToggleDarkMode = () => setDarkMode(!darkMode);
        window.addEventListener("toggleDarkMode", handleToggleDarkMode);
        return () => window.removeEventListener("toggleDarkMode", handleToggleDarkMode);
    }, [darkMode]);

    // Load user data
    useEffect(() => {
        if (!token) {
            toast.warn("Kamu belum login!");
            navigate("/");
            return;
        }

        const loadUser = async () => {
            const result = await bookService.fetchUser();
            if (result.success) {
                setUser(result.data);
            } else {
                if (result.unauthorized) {
                    toast.error("Sesi login berakhir. Silakan login ulang.");
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user");
                    navigate("/");
                }
            }
        };

        loadUser();
    }, [navigate, token]);

    // Load cart items
    useEffect(() => {
        if (!token) return;
        loadCart();
    }, [token]);

    const loadCart = async () => {
        setLoading(true);
        const result = await cartService.fetchCart();
        if (result.success) {
            setCartItems(result.data.items || []);
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    // Update quantity
    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        const result = await cartService.updateCartItem(cartItemId, newQuantity);
        if (result.success) {
            toast.success("Jumlah diperbarui!");
            loadCart();
        } else {
            toast.error(result.error);
        }
    };

    // Remove item
    const handleRemoveItem = async (cartItemId) => {
        if (!confirm("Hapus item ini dari keranjang?")) return;

        const result = await cartService.removeFromCart(cartItemId);
        if (result.success) {
            toast.success("Item dihapus dari keranjang!");
            loadCart();
        } else {
            toast.error(result.error);
        }
    };

    // Clear cart
    const handleClearCart = async () => {
        if (!confirm("Kosongkan semua item di keranjang?")) return;

        const result = await cartService.clearCart();
        if (result.success) {
            toast.success("Keranjang dikosongkan!");
            setCartItems([]);
        } else {
            toast.error(result.error);
        }
    };

    // Calculate totals
    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => {
            return sum + (item.book?.price || 0) * item.quantity;
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.11; // PPN 11%
    const total = subtotal + tax;

    // Proceed to checkout
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.warn("Keranjang masih kosong!");
            return;
        }
        navigate("/checkout");
    };

    if (loading) {
        return (
            <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-gray-900`}>
                <NavbarUser darkMode={darkMode} user={user} />
                <main className="flex-1 flex items-center justify-center p-8">
                    <div className="text-lg">Memuat keranjang...</div>
                </main>
            </div>
        );
    }

    return (
        <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-gray-900`}>
            <NavbarUser darkMode={darkMode} user={user} />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        🛒 Keranjang Belanja
                    </h1>
                    {cartItems.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                            Kosongkan Keranjang
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                            Keranjang belanja Anda kosong
                        </p>
                        <button
                            onClick={() => navigate("/books")}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
                        >
                            Mulai Belanja
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex gap-4"
                                >
                                    <img
                                        src={item.book?.image_url || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"}
                                        alt={item.book?.title}
                                        className="w-24 h-32 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                                            {item.book?.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {item.book?.author || "Tidak diketahui"}
                                        </p>
                                        <p className="font-bold text-green-700 text-lg mb-3">
                                            Rp {item.book?.price?.toLocaleString("id-ID") || "0"}
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border rounded-lg">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 border-x dark:border-gray-600">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    disabled={item.quantity >= (item.book?.stock || 0)}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                            >
                                                Hapus
                                            </button>
                                        </div>

                                        {item.quantity >= (item.book?.stock || 0) && (
                                            <p className="text-xs text-orange-600 mt-2">
                                                Stok maksimal: {item.book?.stock}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                                            Rp {((item.book?.price || 0) * item.quantity).toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Ringkasan Pesanan
                                </h2>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                        <span>Subtotal ({cartItems.length} item)</span>
                                        <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                                        <span>PPN (11%)</span>
                                        <span>Rp {tax.toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                                        <span>Total</span>
                                        <span>Rp {total.toLocaleString("id-ID")}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                                >
                                    Lanjut ke Checkout 💳
                                </button>

                                <button
                                    onClick={() => navigate("/books")}
                                    className="w-full mt-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 rounded-lg transition"
                                >
                                    Lanjut Belanja
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
