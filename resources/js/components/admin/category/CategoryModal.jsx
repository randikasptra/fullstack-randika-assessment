// js/components/admin/CategoryModal.jsx
import React, { useState, useEffect } from "react";

const CategoryModal = ({ isOpen, onClose, onSave, type, initialData }) => {
    const [form, setForm] = useState({ name: "", description: "" });

    useEffect(() => {
        if (isOpen) {
            if (type === 'edit' && initialData) {
                setForm({ name: initialData.name, description: initialData.description || "" });
            } else {
                setForm({ name: "", description: "" });
            }
        }
    }, [isOpen, type, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4">
                    {type === 'edit' ? 'Edit Kategori' : 'Tambah Kategori'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">
                            Nama Kategori
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Contoh: Teknologi"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">
                            Deskripsi
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Deskripsi kategori (opsional)"
                            rows={3}
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

export default CategoryModal;
