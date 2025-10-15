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
    const [modalType, setModalType] = useState("add");
    const [editUser, setEditUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [users, searchTerm]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://127.0.0.1:8000/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Ambil data dan filter hanya role "user"
            const data = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];

            const onlyUsers = data.filter(u => u.role === "user");

            setUsers(onlyUsers);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data user.");
        } finally {
            setLoading(false);
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
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Gagal menyimpan user.");
            }
        }
    };

    return (
        <AdminLayout>
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">👥</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Manajemen User
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelola semua user sistem MouraBook (non-admin)
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total User</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 text-lg">👤</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                    <div className="flex-1 max-w-md">
                        <SearchInput
                            onSearchChange={handleSearchChange}
                            value={searchTerm}
                            placeholder="Cari user berdasarkan nama atau email..."
                        />
                    </div>
                    <button
                        onClick={handleOpenAddModal}
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
                    >
                        <span className="text-lg">+</span>
                        <span>Tambah User</span>
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <UserTable
                        users={filteredUsers}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Modal */}
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
