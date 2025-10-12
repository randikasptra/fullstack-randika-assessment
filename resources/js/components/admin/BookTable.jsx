// js/components/admin/BookTable.jsx
import React from "react";

const BookTable = ({ books, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {books.map((book, index) => (
                        <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {book.image_url ? (
                                    <img
                                        src={book.image_url}
                                        alt={book.title}
                                        className="w-12 h-16 object-cover rounded shadow-sm"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/48x64?text=No+Image';
                                        }}
                                    />
                                ) : (
                                    <div className="w-12 h-16 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">📷</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {book.title}
                                </div>
                                {book.year && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {book.year}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    {book.author || "-"}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    {book.category ? book.category.name : "-"}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    Rp {book.price ? parseFloat(book.price).toLocaleString('id-ID') : "0"}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    {book.stock || 0}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => onEdit(book)}
                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 transition"
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => onDelete(book.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition"
                                >
                                    🗑️ Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                    {books.length === 0 && (
                        <tr>
                            <td colSpan="8" className="text-center py-8 text-gray-500 dark:text-gray-400">
                                📚 Tidak ada buku.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BookTable;
