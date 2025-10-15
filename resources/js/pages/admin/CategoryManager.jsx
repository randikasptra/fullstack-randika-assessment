// resources/js/pages/admin/CategoryManager.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import CategoryTable from "../../components/admin/CategoryTable";
import CategoryModal from "../../components/admin/CategoryModal";
import SearchInputCategory from "../../components/admin/SearchInput";
import * as categoryService from "../../services/admin/categoryService";

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [editCategory, setEditCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        const filtered = categories.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredCategories(filtered);
    }, [categories, searchTerm]);

    const loadCategories = async () => {
        setLoading(true);
        const result = await categoryService.fetchCategories();
        if (result.success) {
            setCategories(result.data);
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const handleOpenAddModal = () => {
        setModalType('add');
        setEditCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (category) => {
        setModalType('edit');
        setEditCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditCategory(null);
    };

    const handleDelete = async (id) => {
        // Cari kategori untuk info konfirmasi
        const category = categories.find(cat => cat.id === id);
        const bookCount = category?.books_count || 0;

        let confirmMessage = "Yakin ingin menghapus kategori ini?";
        if (bookCount > 0) {
            confirmMessage = `⚠️ Kategori ini memiliki ${bookCount} buku. Yakin ingin menghapus?`;
        }

        if (!confirm(confirmMessage)) return;

        const result = await categoryService.deleteCategory(id);

        if (result.success) {
            toast.success("Kategori berhasil dihapus!");
            loadCategories();
        } else {
            // Tampilkan error yang lebih spesifik
            if (result.status === 422) {
                toast.error(result.error);
            } else if (result.status === 403) {
                toast.error("Anda tidak memiliki akses untuk menghapus kategori.");
            } else {
                toast.error(result.error);
            }
        }
    };

    const handleSaveCategory = async (formData) => {
        let result;

        if (modalType === 'edit' && editCategory) {
            result = await categoryService.updateCategory(editCategory.id, formData);
            if (result.success) {
                toast.success("Kategori berhasil diperbarui!");
            }
        } else {
            result = await categoryService.createCategory(formData);
            if (result.success) {
                toast.success("Kategori berhasil ditambahkan!");
            }
        }

        if (result.success) {
            handleCloseModal();
            loadCategories();
        } else {
            // Handle validation errors
            if (result.errors) {
                const errors = Object.values(result.errors).flat();
                errors.forEach(err => toast.error(err));
            } else {
                toast.error(result.error);
            }
        }
    };

    return (
        <AdminLayout>
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">🏷️</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Kelola Kategori
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelola kategori buku di MouraBook Store
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Kategori</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-lg">📚</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Tampil di Pencarian</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{filteredCategories.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 text-lg">🔍</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Kategori dengan Buku</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {categories.filter(cat => cat.books_count > 0).length}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 text-lg">📖</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                    <div className="flex-1 max-w-md">
                        <SearchInputCategory
                            onSearchChange={handleSearchChange}
                            value={searchTerm}
                            placeholder="Cari kategori berdasarkan nama atau deskripsi..."
                        />
                    </div>
                    <button
                        onClick={handleOpenAddModal}
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
                    >
                        <span className="text-lg">+</span>
                        <span>Tambah Kategori</span>
                    </button>
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <CategoryTable
                        categories={filteredCategories}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCategory}
                type={modalType}
                initialData={editCategory}
            />
        </AdminLayout>
    );
};

export default CategoryManager;
