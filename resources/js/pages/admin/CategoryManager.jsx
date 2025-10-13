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
        const result = await categoryService.fetchCategories();
        if (result.success) {
            setCategories(result.data);
        } else {
            toast.error(result.error);
        }
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
            toast.success("🗑️ Kategori berhasil dihapus!");
            loadCategories();
        } else {
            // Tampilkan error yang lebih spesifik
            if (result.status === 422) {
                toast.error("❌ " + result.error);
            } else if (result.status === 403) {
                toast.error("🔒 Anda tidak memiliki akses untuk menghapus kategori.");
            } else {
                toast.error("❌ " + result.error);
            }
        }
    };

    const handleSaveCategory = async (formData) => {
        let result;

        if (modalType === 'edit' && editCategory) {
            result = await categoryService.updateCategory(editCategory.id, formData);
            if (result.success) {
                toast.success("✅ Kategori berhasil diperbarui!");
            }
        } else {
            result = await categoryService.createCategory(formData);
            if (result.success) {
                toast.success("✅ Kategori berhasil ditambahkan!");
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
                toast.error("❌ " + result.error);
            }
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-green-700 mb-6">
                📚 Kelola Kategori Buku
            </h1>

            <div className="mb-6 flex justify-between items-center">
                <SearchInputCategory onSearchChange={handleSearchChange} value={searchTerm} />
                <button
                    onClick={handleOpenAddModal}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                >
                    ➕ Tambah Kategori
                </button>
            </div>

            <CategoryTable
                categories={filteredCategories}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
            />

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
