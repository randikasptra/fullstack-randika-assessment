import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin, XCircle, CheckCircle } from "lucide-react";
import transactionService from "../../services/admin/transactionService";
import AdminLayout from "../../layouts/AdminLayout";

const TransactionDetailAdmin = () => {
    const { id } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchTransaction();
    }, [id]);

    const fetchTransaction = async () => {
        try {
            setLoading(true);
            const response = await transactionService.getTransactionDetail(id);
            if (response.success) {
                const data = response.data;
                const transformedTransaction = {
                    ...data,
                    orderItems: data.order_items || [],
                    shippingAddress: data.shipping_address,
                };
                setTransaction(transformedTransaction);
            } else {
                alert(response.message || "Gagal load transaksi");
            }
        } catch (error) {
            console.error("Error fetching transaction:", error);
            alert(error.message || "Gagal load transaksi");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTransaction = async () => {
        if (!window.confirm("Hapus transaksi ini? Tindakan tidak bisa dibatalkan.")) return;

        try {
            setDeleting(true);
            const response = await transactionService.deleteTransaction(id);
            if (response.success) {
                alert("Transaksi berhasil dihapus");
                window.location.href = "/admin/transactions";
            }
        } catch (error) {
            alert(error.message || "Gagal hapus transaksi");
        } finally {
            setDeleting(false);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

    const getStatusColor = (status) => {
        const colors = {
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return colors[status] || colors.cancelled;
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-xl">Loading transaction details...</div>
                </div>
            </AdminLayout>
        );
    }

    if (!transaction) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-xl text-red-600">Transaction not found</div>
                    <Link to="/admin/history-transaction" className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded">
                        Back to Transactions
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-8 flex items-center gap-4">
                    <Link to="/admin/history-transaction" className="p-2 rounded-lg hover:bg-gray-100">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">Detail Transaksi #{transaction.id}</h1>
                        <p className="text-gray-600">Dibuat pada {formatDate(transaction.created_at)}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(transaction.status)}`}>
                        {transaction.status.toUpperCase()}
                    </span>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Transaction Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-900">Item Transaksi</h2>
                            </div>
                            <div className="space-y-4">
                                {transaction.orderItems && transaction.orderItems.length > 0 ? (
                                    transaction.orderItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                                            <img
                                                src={item.book?.image_url || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                                                alt={item.book?.title}
                                                className="w-24 h-32 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.book?.title || "N/A"}</h3>
                                                {item.book?.author && (
                                                    <p className="text-sm text-gray-600 mb-1">by {item.book.author}</p>
                                                )}
                                                {item.book?.publisher && (
                                                    <p className="text-sm text-gray-600 mb-2">{item.book.publisher}, {item.book.year}</p>
                                                )}
                                                <p className="text-sm text-gray-600 mb-2">Qty: {item.quantity}</p>
                                                <p className="text-sm text-gray-700">Price: {formatCurrency(item.book?.price || 0)}</p>
                                                <p className="text-lg font-bold text-green-700 mt-2">Subtotal: {formatCurrency((item.book?.price || 0) * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No items in this transaction</p>
                                )}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        {transaction.shippingAddress ? (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-xl font-bold text-gray-900">Alamat Pengiriman</h2>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-semibold text-gray-900">{transaction.shippingAddress.recipient_name}</p>
                                    <p className="text-gray-700">{transaction.shippingAddress.phone}</p>
                                    <p className="text-gray-700">{transaction.shippingAddress.address}</p>
                                    <p className="text-gray-600">
                                        {transaction.shippingAddress.city}, {transaction.shippingAddress.province} {transaction.shippingAddress.postal_code}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <p className="text-gray-500 italic">No shipping address provided</p>
                            </div>
                        )}
                    </div>

                    {/* Summary & Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Ringkasan</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Customer</span>
                                    <span>{transaction.user?.name || "N/A"}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Email</span>
                                    <span className="text-sm">{transaction.user?.email || "N/A"}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-green-700">{formatCurrency(transaction.total_price || 0)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Delete Transaction Button */}
                            {transaction.status === "cancelled" && (
                                <button
                                    onClick={handleDeleteTransaction}
                                    disabled={deleting}
                                    className="w-full bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium mb-6"
                                >
                                    {deleting ? "Deleting..." : "Delete Transaction"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default TransactionDetailAdmin;
