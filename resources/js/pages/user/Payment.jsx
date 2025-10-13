import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import paymentService from "../../services/user/paymentService";
import UserLayout from "../../layouts/UserLayout";

export default function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [snapToken, setSnapToken] = useState(null);

    useEffect(() => {
        // Load script dan token secara berurutan
        initializePayment();
    }, [orderId]);

    const initializePayment = async () => {
        try {
            setLoading(true);

            // 1. Load Snap Script dulu
            await loadSnapScript();

            // 2. Baru load payment token
            await getPaymentToken();
        } catch (error) {
            console.error('Initialization error:', error);
            alert(error.message || "Gagal memuat pembayaran");
            navigate("/user/orders");
        } finally {
            setLoading(false);
        }
    };

    const loadSnapScript = () => {
        return new Promise((resolve, reject) => {
            // Cek apakah script sudah ada
            if (window.snap) {
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
            script.setAttribute(
                "data-client-key",
                import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "Mid-client-Vf8NgZIDyCcELaga"
            );

            script.onload = () => {
                console.log('✅ Snap script loaded');
                resolve();
            };

            script.onerror = () => {
                console.error('❌ Failed to load Snap script');
                reject(new Error('Gagal memuat Midtrans script'));
            };

            document.body.appendChild(script);
        });
    };

    const getPaymentToken = async () => {
        try {
            const response = await paymentService.getSnapToken(orderId);

            if (response.success) {
                setOrder(response.order);
                setSnapToken(response.snap_token);

                // Pastikan window.snap sudah ada
                if (!window.snap) {
                    throw new Error('Midtrans Snap belum siap');
                }

                // Auto trigger Midtrans Snap
                window.snap.pay(response.snap_token, {
                    onSuccess: async function (result) {
                        console.log('Payment success:', result);

                        try {
                            await paymentService.updatePaymentStatus(orderId, {
                                status: 'paid',
                                transaction_id: result.transaction_id,
                                payment_type: result.payment_type,
                            });
                            alert("Pembayaran berhasil! ✅");
                        } catch (error) {
                            console.error('Error updating status:', error);
                            alert("Pembayaran berhasil, tapi status belum terupdate");
                        }

                        navigate("/user/orders");
                    },
                    onPending: async function (result) {
                        console.log('Payment pending:', result);
                        alert("Menunggu pembayaran...");
                        navigate("/user/orders");
                    },
                    onError: function (result) {
                        console.log('Payment error:', result);
                        alert("Pembayaran gagal!");
                        navigate("/user/orders");
                    },
                    onClose: function () {
                        console.log('Payment popup closed');
                        alert("Anda menutup popup pembayaran");
                        navigate("/user/orders");
                    },
                });
            }
        } catch (error) {
            console.error('Error loading payment:', error);
            throw error;
        }
    };

    const handlePayAgain = () => {
        if (!window.snap) {
            alert('Midtrans belum siap, silakan refresh halaman');
            return;
        }

        if (snapToken) {
            window.snap.pay(snapToken, {
                onSuccess: async function (result) {
                    try {
                        await paymentService.updatePaymentStatus(orderId, {
                            status: 'paid',
                            transaction_id: result.transaction_id,
                            payment_type: result.payment_type,
                        });
                        alert("Pembayaran berhasil! ✅");
                    } catch (error) {
                        console.error('Error updating status:', error);
                    }
                    navigate("/user/orders");
                },
                onPending: function (result) {
                    alert("Menunggu pembayaran...");
                    navigate("/user/orders");
                },
                onError: function (result) {
                    alert("Pembayaran gagal!");
                    navigate("/user/orders");
                },
                onClose: function () {
                    alert("Anda menutup popup pembayaran");
                    navigate("/user/orders");
                },
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                    Memuat pembayaran...
                </p>
            </div>
        );
    }

    return (
        <UserLayout>
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <CreditCard className="w-24 h-24 mx-auto text-blue-600 mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Pembayaran
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Jika popup pembayaran tidak muncul, silakan klik tombol di bawah
                </p>

                <button
                    onClick={handlePayAgain}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition font-semibold"
                >
                    Bayar Sekarang
                </button>

                {order && (
                    <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h2 className="font-semibold text-lg mb-2">Detail Order</h2>
                        <div className="text-left space-y-2">
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Order ID:</span> #{order.id}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Total:</span> Rp{" "}
                                {order.total_price.toLocaleString("id-ID")}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Status:</span>{" "}
                                <span className={`font-semibold ${
                                    order.status === 'paid' ? 'text-green-600' :
                                    order.status === 'pending' ? 'text-yellow-600' :
                                    'text-red-600'
                                }`}>
                                    {order.status}
                                </span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
