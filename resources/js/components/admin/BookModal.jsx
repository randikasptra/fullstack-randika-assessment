// js/components/admin/BookModal.jsx
import React, { useState, useEffect } from "react";

const BookModal = ({ isOpen, onClose, onSave, type, initialData, categories }) => {
    const [form, setForm] = useState({
        title: "",
        author: "",
        publisher: "",
        year: "",
        price: "",
        stock: "",
        category_id: "",
        description: "",
        image: null
    });

    useEffect(() => {
        if (isOpen) {
            if (type === 'edit' && initialData) {
                setForm({
                    title: initialData.title || "",
                    author: initialData.author || "",
                    publisher: initialData.publisher || "",
                    year: initialData.year || "",
                    price: initialData.price || "",
                    stock: initialData.stock || "",
                    category_id: initialData.category_id || "",
                    description: initialData.description || "",
                    image: null
                });
            } else {
                setForm({
                    title: "",
                    author: "",
                    publisher: "",
                    year: "",
                    price: "",
                    stock: "",
                    category_id: "",
                    description: "",
                    image: null
                });
            }
        }
    }, [isOpen, type, initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append('title', form.title);
        submitData.append('author', form.author);
        submitData.append('publisher', form.publisher);
        submitData.append('year', form.year);
        submitData.append('price', form.price);
        submitData.append('stock', form.stock);
        submitData.append('category_id', form.category_id);
        submitData.append('description', form.description);
        if (form.image) {
            submitData.append('image', form.image);
        }
        onSave(submitData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    {type === 'edit' ? 'Edit Buku' : 'Tambah Buku'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <input
                            type="text"
                            name="title"
                            placeholder="Judul"
                            value={form.title}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />
                        <input
                            type="text"
                            name="author"
                            placeholder="Penulis"
                            value={form.author}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        <input
                            type="text"
                            name="publisher"
                            placeholder="Penerbit"
                            value={form.publisher}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        <input
                            type="number"
                            name="year"
                            placeholder="Tahun"
                            value={form.year}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-3 py-2"
                            min="0"
                            max="9999"
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Harga"
                            value={form.price}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-3 py-2"
                            min="0"
                            step="0.01"
                        />
                        <input
                            type="number"
                            name="stock"
                            placeholder="Stok"
                            value={form.stock}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-3 py-2"
                            min="0"
                        />
                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="">Pilih Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <textarea
                            name="description"
                            placeholder="Deskripsi"
                            value={form.description}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-3 py-2"
                            rows={3}
                        />
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            // onChange={handleFileChange}
                            onChange={(e) => handleTestUpload(e.target.files[0])}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        {type === 'edit' && initialData && initialData.image_url && !form.image && (
                            <div className="mt-2">
                                <img
                                    src={initialData.image_url}
                                    alt="Current book cover"
                                    className="w-20 h-28 object-cover rounded"
                                />
                            </div>
                        )}
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

export default BookModal;
