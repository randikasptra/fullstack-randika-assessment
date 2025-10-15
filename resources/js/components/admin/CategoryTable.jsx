// js/components/admin/CategoryTable.jsx
import React from "react";
import { Edit, Trash2, Book, Hash, FileText } from "lucide-react";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center space-x-2">
                                <Hash className="w-4 h-4" />
                                <span>No</span>
                            </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Nama Kategori
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>Deskripsi</span>
                            </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center space-x-2">
                                <Book className="w-4 h-4" />
                                <span>Jumlah Buku</span>
                            </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {categories.map((cat, index) => (
                        <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block">
                                    {index + 1}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg flex items-center justify-center shadow-sm">
                                        <span className="text-white text-xs font-bold">🏷️</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {cat.name}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-600 max-w-xs">
                                    {cat.description ? (
                                        <span className="line-clamp-2">{cat.description}</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm">
                                    {cat.books_count !== undefined ? (
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            cat.books_count > 0
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                                        }`}>
                                            <Book className="w-3 h-3 mr-1" />
                                            {cat.books_count} buku
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => onEdit(cat)}
                                        className="inline-flex items-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                        title="Edit kategori"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(cat.id)}
                                        className={`inline-flex items-center p-2 rounded-lg transition-colors ${
                                            cat.books_count > 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                                        }`}
                                        title={cat.books_count > 0 ? 'Tidak bisa dihapus, masih ada buku' : 'Hapus kategori'}
                                        disabled={cat.books_count > 0}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {categories.length === 0 && (
                <div className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">🏷️</span>
                        </div>
                        <p className="text-lg font-medium text-gray-600 mb-2">Tidak ada kategori tersedia</p>
                        <p className="text-sm text-gray-500">Mulai dengan menambahkan kategori pertama</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryTable;
