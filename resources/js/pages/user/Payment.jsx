import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle } from "lucide-react";
import cartService from "../../services/user/cartService";
import checkoutService from "../../services/user/checkoutService";
import paymentService from "../../services/user/paymentService";
import orderService from "../../services/user/orderService";
import UserLayout from "../../layouts/UserLayout";

export default function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        loadSnapScript();
        getPaymentToken();
    }, [orderId]);

    const loadSnapScript = () => {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute(
            "data-client-key",
            import.meta.env.VITE_MIDTRANS_CLIENT_KEY ||
                "Mid-client-Vf8NgZIDyCcELaga"
        );
        document.body.appendChild(script);
    };

    const getPaymentToken = async () => {
        try {
            setLoading(true);
            const response = await paymentService.getSnapToken(orderId);

            if (response.success) {
                setOrder(response.order);

                // Auto trigger Midtrans Snap
                window.snap.pay(response.snap_token, {
                    onSuccess: function (result) {
                        alert("Pembayaran berhasil!");
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
        } catch (error) {
            alert(error.message || "Gagal memuat pembayaran");
            navigate("/user/orders");
        } finally {
            setLoading(false);
        }
    };

    const handlePayAgain = () => {
        if (order && order.snap_token) {
            window.snap.pay(order.snap_token);
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
                    Jika popup pembayaran tidak muncul, silakan klik tombol di
                    bawah
                </p>

                <button
                    onClick={handlePayAgain}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition font-semibold"
                >
                    Bayar Sekarang
                </button>

                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h2 className="font-semibold text-lg mb-2">Detail Order</h2>
                    <div className="text-left space-y-2">
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Order ID:</span> #
                            {order?.id}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Total:</span> Rp{" "}
                            {order?.total_price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Status:</span>{" "}
                            {order?.status}
                        </p>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
