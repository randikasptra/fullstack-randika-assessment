// js/pages/admin/CategoryManager.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import CategoryTable from "../../components/admin/CategoryTable";
import CategoryModal from "../../components/admin/CategoryModal";
import SearchInputCategory from "../../components/admin/SearchInputCategory";

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
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
            toast.error("Gagal memuat kategori.");
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
        if (!confirm("Yakin ingin menghapus kategori ini?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Kategori dihapus!");
            fetchCategories();
        } catch (error) {
            toast.error("Gagal menghapus kategori.");
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
                toast.success("Kategori berhasil diperbarui!");
            } else {
                await axios.post(
                    "http://127.0.0.1:8000/api/categories",
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Kategori berhasil ditambahkan!");
            }
            handleCloseModal();
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan kategori.");
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
                    Tambah Kategori
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
