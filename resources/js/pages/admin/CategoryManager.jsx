// js/pages/admin/CategoryManager.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import CategoryTable from "../../components/admin/CategoryTable";
import CategoryModal from "../../components/admin/CategoryModal";
import SearchInputCategory from "../../components/admin/SearchInput";

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [editCategory, setEditCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const filtered = categories.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredCategories(filtered);
    }, [categories, searchTerm]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/categories", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(res.data);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Gagal memuat kategori.";
            toast.error(errorMsg);
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

        try {
            await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("🗑️ Kategori berhasil dihapus!");
            fetchCategories();
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Gagal menghapus kategori.";

            // Tampilkan error yang lebih spesifik
            if (error.response?.status === 422) {
                toast.error("❌ " + errorMsg);
            } else if (error.response?.status === 403) {
                toast.error("🔒 Anda tidak memiliki akses untuk menghapus kategori.");
            } else {
                toast.error("❌ " + errorMsg);
            }
        }
    };

    const handleSaveCategory = async (formData) => {
        try {
            if (modalType === 'edit' && editCategory) {
                await axios.put(
                    `http://127.0.0.1:8000/api/categories/${editCategory.id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("✅ Kategori berhasil diperbarui!");
            } else {
                await axios.post(
                    "http://127.0.0.1:8000/api/categories",
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("✅ Kategori berhasil ditambahkan!");
            }
            handleCloseModal();
            fetchCategories();
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Gagal menyimpan kategori.";

            // Handle validation errors
            if (error.response?.data?.errors) {
                const errors = Object.values(error.response.data.errors).flat();
                errors.forEach(err => toast.error(err));
            } else {
                toast.error("❌ " + errorMsg);
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
