// js/components/admin/CategoryTable.jsx
import React from "react";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Nama Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Deskripsi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Jumlah Buku
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {categories.map((cat, index) => (
                        <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    {index + 1}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {cat.name}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {cat.description || "-"}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    {cat.books_count !== undefined ? (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            cat.books_count > 0
                                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                            📚 {cat.books_count} buku
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => onEdit(cat)}
                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 transition"
                                    title="Edit kategori"
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => onDelete(cat.id)}
                                    className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition ${
                                        cat.books_count > 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    title={cat.books_count > 0 ? 'Tidak bisa dihapus, masih ada buku' : 'Hapus kategori'}
                                >
                                    🗑️ Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {categories.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    📭 Tidak ada kategori tersedia.
                </div>
            )}
        </div>
    );
};

export default CategoryTable;
