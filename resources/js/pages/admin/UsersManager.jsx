// resources/js/pages/admin/UsersManager.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import UserTable from "../../components/admin/UserTable";
import UserModal from "../../components/admin/UserModal";
import SearchInput from "../../components/admin/SearchInput";
import * as userService from "../../services/admin/userService";

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("add"); // 'add' or 'edit'
    const [editUser, setEditUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadUsers();
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

    const loadUsers = async () => {
        const result = await userService.fetchUsers();
        if (result.success) {
            setUsers(result.data);
        } else {
            toast.error(result.error);
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

        const result = await userService.deleteUser(id);
        if (result.success) {
            toast.success("User berhasil dihapus!");
            loadUsers();
        } else {
            toast.error(result.error);
        }
    };

    const handleSaveUser = async (formData) => {
        let result;

        if (modalType === "edit" && editUser) {
            result = await userService.updateUser(editUser.id, formData);
            if (result.success) {
                toast.success("User berhasil diperbarui!");
            }
        } else {
            result = await userService.createUser(formData);
            if (result.success) {
                toast.success("User berhasil ditambahkan!");
            }
        }

        if (result.success) {
            handleCloseModal();
            loadUsers();
        } else {
            toast.error(result.error);
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
