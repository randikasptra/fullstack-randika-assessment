import React, { useState, useEffect } from "react";
import { FaTimes, FaUpload, FaBook, FaUser, FaBuilding, FaCalendar, FaDollarSign, FaBox, FaTag, FaFileAlt } from "react-icons/fa";

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
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setError(null); // Clear errors when modal opens
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
                setPreviewImage(initialData.image_url || null);
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
                setPreviewImage(null);
            }
        }
    }, [isOpen, type, initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // Clear error when user starts typing in title field
        if (name === 'title' && error) {
            setError(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file });
            // Preview gambar
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const submitData = new FormData();
        submitData.append('title', form.title);
        submitData.append('author', form.author || '');
        submitData.append('publisher', form.publisher || '');
        submitData.append('year', form.year || '');
        submitData.append('price', form.price || '0');
        submitData.append('stock', form.stock || '0');
        submitData.append('category_id', form.category_id || '');
        submitData.append('description', form.description || '');

        if (form.image) {
            submitData.append('image', form.image);
        }

        try {
            await onSave(submitData);
            onClose(); // Close modal on successful save
        } catch (error) {
            console.error('Error saving book:', error);
            const errorMessage = error.response?.data?.message || 'Gagal menyimpan buku. Silakan coba lagi.';
            setError(errorMessage);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <FaBook className="text-white text-sm" />
                            </div>
                            <h2 className="text-xl font-bold text-white">
                                {type === 'edit' ? 'Edit Buku' : 'Tambah Buku Baru'}
                            </h2>
                        </div>
                        <button
<<<<<<< HEAD
                            onClick={() => {
                                setError(null); // Clear error on close
                                onClose();
                            }}
=======
                            onClick={onClose}
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <FaTimes className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Grid Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Judul */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-slate-700">
                                    <FaBook className="mr-2 text-blue-500 text-xs" />
                                    Judul Buku *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Masukkan judul buku"
                                    value={form.title}
                                    onChange={handleInputChange}
<<<<<<< HEAD
                                    className={`w-full border ${error ? 'border-red-500' : 'border-slate-300'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    required
                                />
                                {error && (
                                    <p className="text-red-500 text-xs mt-1">{error}</p>
                                )}
=======
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
                            </div>

                            {/* Penulis */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-slate-700">
                                    <FaUser className="mr-2 text-green-500 text-xs" />
                                    Penulis
                                </label>
                                <input
                                    type="text"
                                    name="author"
                                    placeholder="Nama penulis"
                                    value={form.author}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Penerbit */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-slate-700">
                                    <FaBuilding className="mr-2 text-orange-500 text-xs" />
                                    Penerbit
                                </label>
                                <input
                                    type="text"
                                    name="publisher"
                                    placeholder="Nama penerbit"
                                    value={form.publisher}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Tahun */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-slate-700">
                                    <FaCalendar className="mr-2 text-purple-500 text-xs" />
                                    Tahun Terbit
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    placeholder="Tahun"
                                    value={form.year}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    min="1900"
                                    max="2100"
                                />
                            </div>

                            {/* Harga */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-slate-700">
                                    <FaDollarSign className="mr-2 text-green-500 text-xs" />
                                    Harga
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Harga buku"
                                    value={form.price}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            {/* Stok */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-slate-700">
                                    <FaBox className="mr-2 text-blue-500 text-xs" />
                                    Stok
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    placeholder="Jumlah stok"
                                    value={form.stock}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    min="0"
                                />
                            </div>

                            {/* Kategori */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-slate-700">
                                    <FaTag className="mr-2 text-red-500 text-xs" />
                                    Kategori
                                </label>
                                <select
                                    name="category_id"
                                    value={form.category_id}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Upload Gambar */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-slate-700">
                                    <FaUpload className="mr-2 text-cyan-500 text-xs" />
                                    Cover Buku
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    onChange={handleFileChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-slate-700">
                                <FaFileAlt className="mr-2 text-slate-500 text-xs" />
                                Deskripsi Buku
                            </label>
                            <textarea
                                name="description"
                                placeholder="Masukkan deskripsi buku..."
                                value={form.description}
                                onChange={handleInputChange}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                rows={3}
                            />
                        </div>

                        {/* Preview Image */}
                        {previewImage && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Preview Cover</label>
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-20 h-28 object-cover rounded-lg border-2 border-slate-200 shadow-sm"
                                    />
                                    <div className="text-sm text-slate-600">
                                        <p className="font-medium">Cover Preview</p>
                                        <p className="text-xs text-slate-500">Gambar akan ditampilkan seperti ini</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
<<<<<<< HEAD
                            onClick={() => {
                                setError(null); // Clear error on close
                                onClose();
                            }}
=======
                            onClick={onClose}
>>>>>>> b5820b4 (fix(admin): redesign booklist view)
                            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-colors duration-200"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            {type === 'edit' ? 'Perbarui Buku' : 'Tambah Buku'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookModal;
