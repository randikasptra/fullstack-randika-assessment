// js/pages/admin/UsersManager.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import UserTable from "../../components/admin/UserTable";
import UserModal from "../../components/admin/UserModal";
import SearchInput from "../../components/admin/SearchInput";

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("add"); // 'add' or 'edit'
    const [editUser, setEditUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [users, searchTerm]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(Array.isArray(res.data) ? res.data : res.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data user.");
        }
    };

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const handleOpenAddModal = () => {
        setModalType("add");
        setEditUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setModalType("edit");
        setEditUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditUser(null);
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus user ini?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("User berhasil dihapus!");
            fetchUsers();
        } catch (error) {
            toast.error("Gagal menghapus user.");
        }
    };

    const handleSaveUser = async (formData) => {
        try {
            if (modalType === "edit" && editUser) {
                await axios.put(
                    `http://127.0.0.1:8000/api/users/${editUser.id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("User berhasil diperbarui!");
            } else {
                await axios.post("http://127.0.0.1:8000/api/users", formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("User berhasil ditambahkan!");
            }
            handleCloseModal();
            fetchUsers();
        } catch (error) {
            console.error(error);

            // 🟡 tampilkan pesan dari backend jika ada
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Gagal menyimpan user.");
            }
        }
    };

    return (
        <AdminLayout>
            <header className="bg-white shadow-sm mb-6">
                <div className="px-6 py-4">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        👥 Manajemen User
                    </h1>
                    <p className="text-gray-600">
                        Kelola semua user sistem di sini.
                    </p>
                </div>
            </header>

            <div className="mb-6 flex justify-between items-center">
                <SearchInput
                    onSearchChange={handleSearchChange}
                    value={searchTerm}
                />
                <button
                    onClick={handleOpenAddModal}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                >
                    Tambah User
                </button>
            </div>

            <UserTable
                users={filteredUsers}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
            />

            <UserModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveUser}
                type={modalType}
                initialData={editUser}
            />
        </AdminLayout>
    );
};

export default UsersManager;
