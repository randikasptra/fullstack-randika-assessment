import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Phone, User, Home } from 'lucide-react';
import cartService from '../../services/user/cartService';
import checkoutService from '../../services/user/checkoutService';
import paymentService from '../../services/user/paymentService';
import orderService from '../../services/user/orderService';
import UserLayout from "../../layouts/UserLayout";

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const isBuyNow = location.state?.buyNow || false;
    const buyNowData = location.state?.data || null;
    const fromCartSelected = location.state?.fromCart || false;
    const selectedCartItems = location.state?.selectedCartItems || null;

    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        recipient_name: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postal_code: '',
    });

    useEffect(() => {
        if (isBuyNow) {
            setCartItems([buyNowData]);
            setTotal(buyNowData.book.price * buyNowData.quantity);
        } else if (fromCartSelected && selectedCartItems) {
            // Handle selected items from cart checkbox
            setCartItems(selectedCartItems);
            setTotal(location.state.total || 0);
        } else {
            // Fallback to full cart
            fetchCart();
        }
    }, [isBuyNow, buyNowData, fromCartSelected, selectedCartItems, location.state]);

    const fetchCart = async () => {
        try {
            const response = await cartService.index(); // Fix: ganti getCart() ke index()
            const cartData = response.data; // response.data adalah {success, data: [], total}
            if (cartData.data.length === 0) {
                alert('Keranjang kosong');
                navigate('/user/cart');
                return;
            }
            setCartItems(cartData.data);
            setTotal(cartData.total);
        } catch (error) {
            console.error('Error fetching cart:', error);
            alert(error.message || 'Gagal memuat keranjang');
            navigate('/user/cart');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;
            if (isBuyNow) {
                response = await checkoutService.buyNow(
                    buyNowData.book.id,
                    buyNowData.quantity,
                    formData
                );
            } else {
                // Untuk selected items, perlu pass cart_item_ids ke API
                // Sementara fetch full cart di backend, tapi kalo mau support selected, update controller
                // Di sini, pass formData aja (backend handle full cart)
                response = await checkoutService.createOrderFromCart(formData);
            }

            if (response.success) {
                alert('Order berhasil dibuat!');
                // Clear cart setelah sukses (optional, backend udah clear)
                if (!isBuyNow) {
                    await cartService.clear();
                }
                navigate(`/user/payment/${response.data.id}`);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert(error.message || 'Gagal membuat order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Checkout
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form Pengiriman */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Alamat Pengiriman
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Nama Penerima
                                    </label>
                                    <input
                                        type="text"
                                        name="recipient_name"
                                        value={formData.recipient_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Masukkan nama penerima"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Nomor Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <Home className="w-4 h-4 inline mr-2" />
                                        Alamat Lengkap
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Kota/Kabupaten
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Contoh: Jakarta Selatan"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Provinsi
                                        </label>
                                        <input
                                            type="text"
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Contoh: DKI Jakarta"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-2" />
                                        Kode Pos
                                    </label>
                                    <input
                                        type="text"
                                        name="postal_code"
                                        value={formData.postal_code}
                                        onChange={handleChange}
                                        required
                                        maxLength="5"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="12345"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition font-semibold"
                                >
                                    {loading ? 'Memproses...' : 'Buat Pesanan'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Ringkasan Pesanan
                            </h2>

                            <div className="space-y-3 mb-6">
                                {isBuyNow ? (
                                    <div className="flex gap-3 pb-3 border-b">
                                        <img
                                            src={buyNowData.book.image_url || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"}
                                            alt={buyNowData.book.title}
                                            className="w-16 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                                                {buyNowData.book.title}
                                            </h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {buyNowData.quantity} x Rp {buyNowData.book.price.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3 pb-3 border-b">
                                            <img
                                                src={item.book.image_url || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"}
                                                alt={item.book.title}
                                                className="w-16 h-20 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                                                    {item.book.title}
                                                </h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {item.quantity} x Rp {item.book.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}

                                <div className="pt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                                        <span>Total</span>
                                        <span className="text-green-700">
                                            Rp {total.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
