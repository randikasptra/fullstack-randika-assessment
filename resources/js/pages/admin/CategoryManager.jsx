import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout"; // Gunakan layout admin

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: "", description: "" });
    const [editId, setEditId] = useState(null);

    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        fetchCategories();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(
                    `http://127.0.0.1:8000/api/categories/${editId}`,
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Kategori berhasil diperbarui!");
            } else {
                await axios.post(
                    "http://127.0.0.1:8000/api/categories",
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Kategori berhasil ditambahkan!");
            }
            setForm({ name: "", description: "" });
            setEditId(null);
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan kategori.");
        }
    };

    const handleEdit = (cat) => {
        setForm({ name: cat.name, description: cat.description });
        setEditId(cat.id);
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

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-green-700 mb-6">
                📚 Kelola Kategori Buku
            </h1>

            {/* Form tambah/edit kategori */}
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8"
            >
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
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">
                        Deskripsi
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Deskripsi kategori (opsional)"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                >
                    {editId ? "Perbarui Kategori" : "Tambah Kategori"}
                </button>
            </form>

            {/* Daftar kategori */}
            <div className="grid gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                    >
                        <div>
                            <h3 className="font-semibold">{cat.name}</h3>
                            <p className="text-gray-600 text-sm">{cat.description || "-"}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(cat)}
                                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
};

export default CategoryManager;
