import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreditCard, AlertCircle } from "lucide-react";
import paymentService from "../../services/user/paymentService";
import UserLayout from "../../layouts/UserLayout";

export default function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [snapToken, setSnapToken] = useState(null);
    const [statusPolling, setStatusPolling] = useState(null);
    const [pollInterval, setPollInterval] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false); // Flag to track success alert

    useEffect(() => {
        initializePayment();
        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [orderId]);

    const initializePayment = async () => {
        try {
            setLoading(true);
            await loadSnapScript();
            await getPaymentToken();

            // Polling status every 10 seconds (fallback detect expired)
            const interval = setInterval(async () => {
                try {
                    const statusResponse = await paymentService.getOrderDetail(orderId);
                    if (statusResponse.success && statusResponse.data.status !== 'pending') {
                        setStatusPolling(statusResponse.data.status);
                        clearInterval(interval);
                        if (statusResponse.data.status === 'cancelled' || statusResponse.data.status === 'expired') {
                            alert("Pembayaran expired/cancelled. Stok otomatis dikembalikan! Bayar ulang yuk.");
                        }
                        // No alert for 'paid' here, handled by onSuccess
                    }
                } catch (error) {
                    console.error('Polling error:', error);
                }
            }, 10000);
            setPollInterval(interval);
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
            if (window.snap) {
                console.log('✅ Snap already loaded');
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
                console.log('✅ Snap script loaded successfully');
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
                console.log('Snap token ready:', response.snap_token.substring(0, 10) + '...');

                if (!window.snap) {
                    throw new Error('Midtrans Snap belum siap—coba refresh');
                }

                // Auto trigger Snap
                console.log('Triggering snap.pay...');
                window.snap.pay(response.snap_token, {
                    onSuccess: async function (result) {
                        console.log('✅ Payment success:', result);
                        if (!paymentSuccess) { // Show alert only if not shown before
                            try {
                                await paymentService.updatePaymentStatus(orderId, {
                                    status: 'paid',
                                    transaction_id: result.transaction_id,
                                    payment_type: result.payment_type,
                                });
                                alert("Pembayaran berhasil! ✅");
                                setPaymentSuccess(true); // Set flag to prevent duplicate alerts
                            } catch (error) {
                                console.error('Update status error:', error);
                                alert("Pembayaran OK, webhook handle sisanya");
                            }
                            navigate("/user/orders");
                        }
                    },
                    onPending: async function (result) {
                        console.log('⏳ Payment pending:', result);
                        alert("Menunggu pembayaran... Cek email/SMS!");
                        navigate("/user/orders");
                    },
                    onError: function (result) {
                        console.log('❌ Payment error:', result);
                        alert("Pembayaran gagal: " + (result.status_message || 'Coba lagi'));
                        navigate("/user/orders");
                    },
                    onClose: function () {
                        console.log('🔒 Payment popup closed');
                        alert("Popup ditutup. Status dicek otomatis...");
                        // Let polling continue to detect expired
                    },
                });
            }
        } catch (error) {
            console.error('Error loading payment:', error);
            throw error;
        }
    };

    const handlePayAgain = () => {
        if (!window.snap || !snapToken) {
            alert('Snap belum siap atau token expired. Refresh halaman.');
            return;
        }
        console.log('Manual trigger snap.pay...');
        window.snap.pay(snapToken, {
            onSuccess: async (result) => {
                if (!paymentSuccess) { // Show alert only if not shown before
                    console.log('✅ Retry success:', result);
                    try {
                        await paymentService.updatePaymentStatus(orderId, {
                            status: 'paid',
                            transaction_id: result.transaction_id,
                            payment_type: result.payment_type,
                        });
                        alert("Pembayaran berhasil! ✅");
                        setPaymentSuccess(true); // Set flag to prevent duplicate alerts
                    } catch (error) {
                        console.error('Retry update error:', error);
                    }
                    navigate("/user/orders");
                }
            },
            onPending: (result) => {
                alert("Menunggu pembayaran...");
                navigate("/user/orders");
            },
            onError: (result) => {
                alert("Pembayaran gagal!");
                navigate("/user/orders");
            },
            onClose: () => {
                alert("Popup ditutup. Status dicek...");
            },
        });
    };

    // Placeholder data for skeleton
    const placeholderOrder = {
        id: orderId || "000",
        total_price: 0,
        status: "pending"
    };

    const displayOrder = loading ? placeholderOrder : order;

    return (
        <UserLayout>
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <CreditCard className={`w-24 h-24 mx-auto mb-6 ${loading ? 'animate-pulse text-gray-300' : 'text-blue-600'}`} />
                <h1 className={`text-3xl font-bold ${loading ? 'text-gray-300' : 'text-gray-900 dark:text-white'} mb-4`}>Pembayaran</h1>
                <p className={`text-gray-600 dark:text-gray-400 mb-8 ${loading ? 'animate-pulse' : ''}`}>
                    {loading ? "Memuat pembayaran..." : "Klik \"Bayar Sekarang\" buat buka popup Midtrans. Kalau gak muncul, cek console atau pakai ngrok HTTPS."}
                </p>

                {statusPolling && (
                    <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span>Status: {statusPolling} (Stok dikembalikan!)</span>
                    </div>
                )}

                <button
                    onClick={handlePayAgain}
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!snapToken || statusPolling === 'paid' || loading}
                >
                    {loading ? "Memuat..." : "Bayar Sekarang"}
                </button>

                <div className={`mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg ${loading ? 'animate-pulse' : ''}`}>
                    <h2 className={`font-semibold text-lg mb-2 ${loading ? 'text-gray-300' : ''}`}>Detail Order</h2>
                    <div className="text-left space-y-2">
                        <p><span className={`font-medium ${loading ? 'text-gray-300' : ''}`}>Order ID:</span> #{displayOrder.id}</p>
                        <p><span className={`font-medium ${loading ? 'text-gray-300' : ''}`}>Total:</span> Rp {displayOrder.total_price.toLocaleString("id-ID")}</p>
                        <p><span className={`font-medium ${loading ? 'text-gray-300' : ''}`}>Status:</span>
                            <span className={`font-semibold ${
                                loading ? 'text-gray-300' :
                                displayOrder.status === 'paid' ? 'text-green-600' :
                                displayOrder.status === 'pending' ? 'text-yellow-600' :
                                'text-red-600'
                            }`}>
                                {loading ? "Memuat..." : displayOrder.status}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
