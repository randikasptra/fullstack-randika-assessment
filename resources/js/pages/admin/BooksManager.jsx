// resources/js/pages/admin/BooksManager.jsx
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";
import BookTable from "../../components/admin/BookTable";
import BookModal from "../../components/admin/BookModal";
import SearchInput from "../../components/admin/SearchInput";
import * as bookService from "../../services/admin/bookService";
import {
    BookOpenIcon,
    MagnifyingGlassIcon,
    TagIcon,
} from "@heroicons/react/24/outline";
import echo from "../../../lib/echo";

const BooksManager = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [editBook, setEditBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const subscribedChannels = useRef(new Set());

    useEffect(() => {
        loadBooks();
        loadCategories();
    }, []);

    useEffect(() => {
        const filtered = books.filter(
            (book) =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (book.author &&
                    book.author
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
        );
        setFilteredBooks(filtered);
    }, [books, searchTerm]);

    // ✅ FIXED: WebSocket setup sekali saja, setelah books loaded (one-time init)
    useEffect(() => {
        if (books.length === 0) return;

        // Setup hanya jika belum diinisialisasi
        if (subscribedChannels.current.size > 0) return;

        console.log(
            "🔊 Admin: Setting up WebSocket for",
            books.length,
            "books (one-time init)"
        );
        console.log(
            "📋 Admin: Book IDs:",
            books.map((b) => b.id)
        );

        books.forEach((book) => {
            const channelName = `products.${book.id}`;

            console.log(`🔌 Admin: Subscribing to ${channelName}...`);

            const channel = echo.channel(channelName);

            channel.subscribed(() => {
                console.log(
                    `✅ Admin: Successfully subscribed to ${channelName}`
                );
            });

            channel.error((error) => {
                console.error(`❌ Admin: Error on ${channelName}:`, error);
            });

            // Listen for stock updates
            channel.listen(".stock.updated", (data) => {
                if (!data.id || typeof data.stock !== "number") {
                    console.warn("⚠️ Invalid stock data:", data);
                    return;
                }
                // Update book in real-time
                setBooks((prevBooks) => {
                    const updated = prevBooks.map((b) =>
                        b.id === data.id
                            ? { ...b, stock: data.stock, title: data.title }
                            : b
                    );
                    console.log("🔄 Admin: Books updated in state");
                    return updated;
                });

                // Show toast notification
                toast.info(
                    `📦 Stock updated: ${data.title} (Stok: ${data.stock})`,
                    {
                        position: "bottom-right",
                        autoClose: 3000,
                    }
                );
            });

            subscribedChannels.current.add(channelName);
        });

        console.log(
            "📡 Admin: Active channels:",
            Array.from(subscribedChannels.current)
        );

        // Cleanup hanya saat unmount component
        return () => {
            console.log("👋 Admin: Cleaning up WebSocket channels on unmount");
            subscribedChannels.current.forEach((channelName) => {
                echo.leave(channelName);
                console.log(`❌ Admin: Left ${channelName}`);
            });
            subscribedChannels.current.clear();
        };
    }, []); // Dependency kosong: run sekali saja setelah mount

    // Tambah useEffect untuk handle books change (jika ada book baru/hapus, subscribe dynamically)
    useEffect(() => {
        if (books.length === 0) return;

        // Subscribe ke book baru yang belum ada channel
        books.forEach((book) => {
            const channelName = `products.${book.id}`;
            if (!subscribedChannels.current.has(channelName)) {
                console.log(
                    `➕ Admin: Adding new subscription for ${channelName}`
                );
                const channel = echo.channel(channelName);

                channel.subscribed(() => {
                    console.log(
                        `✅ Admin: Added subscription to ${channelName}`
                    );
                });

                channel.error((error) => {
                    console.error(`❌ Admin: Error on ${channelName}:`, error);
                });

                // Listen for stock updates (sama seperti di atas)
                channel.listen(".stock.updated", (data) => {
                    console.log(
                        `📦 Admin: Stock updated for book ${data.id}:`,
                        data
                    );

                    setBooks((prevBooks) => {
                        const updated = prevBooks.map((b) =>
                            b.id === data.id
                                ? { ...b, stock: data.stock, title: data.title }
                                : b
                        );
                        console.log("🔄 Admin: Books updated in state");
                        return updated;
                    });

                    toast.info(
                        `📦 Stock updated: ${data.title} (Stok: ${data.stock})`,
                        {
                            position: "bottom-right",
                            autoClose: 3000,
                        }
                    );
                });

                subscribedChannels.current.add(channelName);
            }
        });

        // Unsubscribe channel lama yang buku-nya sudah dihapus
        const currentIds = new Set(books.map((b) => `products.${b.id}`));
        subscribedChannels.current.forEach((channelName) => {
            if (!currentIds.has(channelName)) {
                console.log(
                    `➖ Admin: Removing old subscription ${channelName}`
                );
                echo.leave(channelName);
                subscribedChannels.current.delete(channelName);
            }
        });
    }, [books.length]); // Re-run hanya jika jumlah books berubah (add/delete)

    const loadBooks = async () => {
        setLoading(true);
        const result = await bookService.fetchBooks();
        if (result.success) {
            console.log("📚 Admin: Loaded books:", result.data.length);
            setBooks(result.data);
        } else {
            toast.error(result.error);
        }
        setLoading(false);
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
        setModalType("add");
        setEditBook(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (book) => {
        setModalType("edit");
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

        if (modalType === "edit" && editBook) {
            console.log("📝 Admin: Updating book:", editBook.id);
            result = await bookService.updateBook(editBook.id, formData);
            if (result.success) {
                toast.success("Buku berhasil diperbarui!");
            }
        } else {
            console.log("➕ Admin: Creating new book");
            result = await bookService.createBook(formData);
            if (result.success) {
                toast.success("Buku berhasil ditambahkan!");
            }
        }

        if (result.success) {
            handleCloseModal();
            await loadBooks(); // Reload to get fresh data
        } else {
            toast.error(result.error);
        }
    };

    return (
        <AdminLayout>
            {/* Header Section */}
            <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-white text-lg">📖</span>
                    </div>
                    <div className="w-full sm:w-auto">
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Kelola Buku
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm">
                            Kelola koleksi buku di MouraBook Store
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-white rounded-xl border border-blue-100 p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">
                                Total Buku
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-blue-600 mt-1">
                                {books.length}
                            </p>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2 sm:ml-0">
                            <BookOpenIcon className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-cyan-100 p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">
                                Hasil Pencarian
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-cyan-600 mt-1">
                                {filteredBooks.length}
                            </p>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2 sm:ml-0">
                            <MagnifyingGlassIcon className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-purple-100 p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-slate-600 text-xs sm:text-sm font-medium truncate">
                                Kategori
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-purple-600 mt-1">
                                {categories.length}
                            </p>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2 sm:ml-0">
                            <TagIcon className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-xl border border-blue-100 p-3 sm:p-4 mb-6 shadow-sm">
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="w-full sm:w-auto sm:flex-1 sm:max-w-md">
                        <SearchInput
                            onSearchChange={handleSearchChange}
                            value={searchTerm}
                            placeholder="Cari buku berdasarkan judul atau penulis..."
                        />
                    </div>
                    <button
                        onClick={handleOpenAddModal}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-4 sm:px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                        <span className="text-base sm:text-lg">+</span>
                        <span>Tambah Buku</span>
                    </button>
                </div>
            </div>

            {/* Books Table */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-8 sm:py-12">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <BookTable
                        books={filteredBooks}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Modal */}
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
