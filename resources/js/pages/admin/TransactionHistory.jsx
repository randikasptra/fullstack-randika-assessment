import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TransactionService from "../../services/admin/transactionService";
import AdminLayout from "../../layouts/AdminLayout";

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [filters, setFilters] = useState({
        status: "",
        start_date: "",
        end_date: "",
        search: "",
        page: 1,
        per_page: 20,
    });
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await TransactionService.getTransactions(filters);
            setTransactions(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total,
            });
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Unauthorized access. Please log in again.");
                setTimeout(() => navigate("/admin/login"), 2000); // Redirect ke login admin
            } else {
                setError(
                    "Failed to fetch transactions: " +
                        (error.response?.data?.message || error.message)
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (page) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    const handleExport = async () => {
        try {
            const response = await TransactionService.exportTransactions(
                filters
            );
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `transaction_history_${new Date().toISOString()}.csv`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting CSV:", error);
            setError(
                "Failed to export transactions: " +
                    (error.response?.data?.message || error.message)
            );
        }
    };

    return (
        <AdminLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Transaction History</h1>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="mb-4 flex flex-wrap gap-4">
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="border p-2 rounded"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <input
                        type="date"
                        name="start_date"
                        value={filters.start_date}
                        onChange={handleFilterChange}
                        className="border p-2 rounded"
                    />
                    <input
                        type="date"
                        name="end_date"
                        value={filters.end_date}
                        onChange={handleFilterChange}
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search by user name or email"
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={handleExport}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Export CSV
                    </button>
                </div>

                {/* Table */}
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border">
                                        Order ID
                                    </th>
                                    <th className="px-4 py-2 border">User</th>
                                    <th className="px-4 py-2 border">Total</th>
                                    <th className="px-4 py-2 border">Status</th>
                                    <th className="px-4 py-2 border">Date</th>
                                    <th className="px-4 py-2 border">
                                        Tracking
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td className="px-4 py-2 border">
                                            {transaction.id}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {transaction.user?.name ?? "N/A"} (
                                            {transaction.user?.email ?? "N/A"})
                                        </td>
                                        <td className="px-4 py-2 border">
                                            Rp{" "}
                                            {transaction.orderItems
                                                .reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        item.price *
                                                            item.quantity,
                                                    0
                                                )
                                                .toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {transaction.status}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {new Date(
                                                transaction.created_at
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {transaction.tracking_number ??
                                                "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() =>
                            handlePageChange(pagination.current_page - 1)
                        }
                        disabled={pagination.current_page === 1}
                        className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <button
                        onClick={() =>
                            handlePageChange(pagination.current_page + 1)
                        }
                        disabled={
                            pagination.current_page === pagination.last_page
                        }
                        className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default TransactionHistory;
