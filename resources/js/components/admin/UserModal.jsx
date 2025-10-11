// js/components/admin/UserModal.jsx
import React, { useState, useEffect } from "react";

const UserModal = ({ isOpen, onClose, onSave, type, initialData }) => {
    const [form, setForm] = useState({ name: "", email: "", role: "user", password: "", password_confirmation: "" });

    useEffect(() => {
        if (isOpen) {
            if (type === 'edit' && initialData) {
                setForm({
                    name: initialData.name,
                    email: initialData.email,
                    role: initialData.role,
                    password: "",
                    password_confirmation: ""
                });
            } else {
                setForm({ name: "", email: "", role: "user", password: "", password_confirmation: "" });
            }
        }
    }, [isOpen, type, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password !== form.password_confirmation) {
            alert("Password dan konfirmasi password tidak cocok!");
            return;
        }
        onSave(form);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    {type === 'edit' ? 'Edit User' : 'Tambah User'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Nama"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            required={type === 'add'}
                        />
                        <input
                            type="password"
                            placeholder="Konfirmasi Password"
                            value={form.password_confirmation}
                            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            required={type === 'add'}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                        >
                            {type === 'edit' ? 'Perbarui' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
