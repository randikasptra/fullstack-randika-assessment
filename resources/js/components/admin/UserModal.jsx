// js/components/admin/UserModal.jsx
import React, { useState, useEffect } from "react";
import { X, User, Mail, Shield, Key, Save } from "lucide-react";

const UserModal = ({ isOpen, onClose, onSave, type, initialData }) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "user",
        password: "",
        password_confirmation: ""
    });

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
                setForm({
                    name: "",
                    email: "",
                    role: "user",
                    password: "",
                    password_confirmation: ""
                });
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <User className="text-white text-sm" />
                            </div>
                            <h2 className="text-xl font-bold text-white">
                                {type === 'edit' ? 'Edit User' : 'Tambah User Baru'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <X className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <User className="mr-2 text-blue-500 text-xs" />
                                Nama *
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan nama lengkap"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <Mail className="mr-2 text-green-500 text-xs" />
                                Email *
                            </label>
                            <input
                                type="email"
                                placeholder="Masukkan alamat email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Role */}
                        {/* <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <Shield className="mr-2 text-purple-500 text-xs" />
                                Role *
                            </label>
                            <select
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div> */}

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <Key className="mr-2 text-orange-500 text-xs" />
                                Password {type === 'add' && '*'}
                            </label>
                            <input
                                type="password"
                                placeholder={type === 'add' ? "Masukkan password" : "Kosongkan jika tidak ingin mengubah"}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required={type === 'add'}
                            />
                        </div>

                        {/* Konfirmasi Password */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <Key className="mr-2 text-orange-500 text-xs" />
                                Konfirmasi Password {type === 'add' && '*'}
                            </label>
                            <input
                                type="password"
                                placeholder={type === 'add' ? "Konfirmasi password" : "Kosongkan jika tidak ingin mengubah"}
                                value={form.password_confirmation}
                                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required={type === 'add'}
                            />
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>{type === 'edit' ? 'Perbarui User' : 'Tambah User'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
