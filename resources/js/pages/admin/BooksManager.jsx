// js/pages/admin/BooksManager.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import BookTable from "../../components/admin/BookTable";
import BookModal from "../../components/admin/BookModal";
import SearchInput from "../../components/admin/SearchInput";

const BooksManager = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [editBook, setEditBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        fetchBooks();
        fetchCategories();
    }, []);

    useEffect(() => {
        const filtered = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredBooks(filtered);
    }, [books, searchTerm]);

    const fetchBooks = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/books", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooks(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat buku.");
        }
    };

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
        setEditBook(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (book) => {
        setModalType('edit');
        setEditBook(book);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditBook(null);
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus buku ini?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Buku dihapus!");
            fetchBooks();
        } catch (error) {
            toast.error("Gagal menghapus buku.");
        }
    };

    const handleSaveBook = async (formData) => {
        try {
            if (modalType === 'edit' && editBook) {
                await axios.put(
                    `http://127.0.0.1:8000/api/books/${editBook.id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Buku berhasil diperbarui!");
            } else {
                await axios.post(
                    "http://127.0.0.1:8000/api/books",
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Buku berhasil ditambahkan!");
            }
            handleCloseModal();
            fetchBooks();
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan buku.");
        }
    };

    // misal di BooksManager.jsx atau file test
const handleTestUpload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post("http://127.0.0.1:8000/api/test-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Upload success:", res.data);
  } catch (err) {
    console.error("Upload error:", err.response?.data || err);
  }
};


    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-green-700 mb-6">
                📖 Kelola Buku
            </h1>

            <div className="mb-6 flex justify-between items-center">
                <SearchInput onSearchChange={handleSearchChange} value={searchTerm} />
                <button
                    onClick={handleOpenAddModal}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                >
                    Tambah Buku
                </button>
            </div>

            <BookTable
                books={filteredBooks}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
            />

            <BookModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveBook}
                type={modalType}
                initialData={editBook}
                categories={categories}
            />
        </AdminLayout>
    );
};

export default BooksManager;
