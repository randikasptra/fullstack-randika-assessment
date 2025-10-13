// resources/js/pages/admin/BooksManager.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import BookTable from "../../components/admin/BookTable";
import BookModal from "../../components/admin/BookModal";
import SearchInput from "../../components/admin/SearchInput";
import * as bookService from "../../services/admin/bookService";

const BooksManager = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [editBook, setEditBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadBooks();
        loadCategories();
    }, []);

    useEffect(() => {
        const filtered = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredBooks(filtered);
    }, [books, searchTerm]);

    const loadBooks = async () => {
        const result = await bookService.fetchBooks();
        if (result.success) {
            setBooks(result.data);
        } else {
            toast.error(result.error);
        }
    };

    const loadCategories = async () => {
        const result = await bookService.fetchCategories();
        if (result.success) {
            setCategories(result.data);
        } else {
            toast.error(result.error);
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

        const result = await bookService.deleteBook(id);
        if (result.success) {
            toast.success("Buku dihapus!");
            loadBooks();
        } else {
            toast.error(result.error);
        }
    };

    const handleSaveBook = async (formData) => {
        let result;

        if (modalType === 'edit' && editBook) {
            result = await bookService.updateBook(editBook.id, formData);
            if (result.success) {
                toast.success("Buku berhasil diperbarui!");
            }
        } else {
            result = await bookService.createBook(formData);
            if (result.success) {
                toast.success("Buku berhasil ditambahkan!");
            }
        }

        if (result.success) {
            handleCloseModal();
            loadBooks();
        } else {
            toast.error(result.error);
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
