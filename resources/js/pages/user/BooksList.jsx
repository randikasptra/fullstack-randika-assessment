import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookService from "../../services/user/bookService";
import cartService from "../../services/user/cartService";
import { Search, ShoppingCart, BookOpen } from "lucide-react";
import UserLayout from "../../layouts/UserLayout";


export default function BooksList() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadBooks();
    }, []);

   const loadBooks = async () => {
    try {
        setLoading(true);
        const response = await bookService.getAllBooks();

        console.log('Full response:', response); // Debug

        // Handle jika response adalah object dengan property data
        let booksData = [];
        if (response && typeof response === 'object') {
            if (Array.isArray(response)) {
                booksData = response;
            } else if (response.data && Array.isArray(response.data)) {
                booksData = response.data;
            }
        }

        setBooks(booksData);
        setFilteredBooks(booksData);
    } catch (error) {
        console.error("Error loading books:", error);
        alert(error.message || "Gagal memuat buku");
    } finally {
        setLoading(false);
    }
};

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query === "") {
            setFilteredBooks(books);
        } else {
            const filtered = books.filter(
                (book) =>
                    book.title.toLowerCase().includes(query) ||
                    book.author?.toLowerCase().includes(query) ||
                    book.publisher?.toLowerCase().includes(query)
            );
            setFilteredBooks(filtered);
        }
    };

    const handleAddToCart = async (bookId) => {
        try {
            const response = await cartService.addToCart(bookId, 1);
            if (response.success) {
                alert("Berhasil ditambahkan ke keranjang! 🛒");
            }
        } catch (error) {
            alert(error.message || "Gagal menambahkan ke keranjang");
        }
    };

    const handleBuyNow = (bookId) => {
        const book = filteredBooks.find((b) => b.id === bookId);
        if (!book) return;

        navigate("/user/checkout", {
            state: {
                buyNow: true,
                data: {
                    book: book,
                    quantity: 1,
                },
            },
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <UserLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Katalog Buku
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate("/user/cart")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Keranjang
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Cari buku berdasarkan judul, penulis, atau penerbit..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                </div>

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Tidak Ada Buku
                        </h2>
                        <p className="text-gray-500">
                            {searchQuery
                                ? "Tidak ditemukan buku yang sesuai"
                                : "Belum ada buku tersedia"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition dark:border dark:border-gray-700"
                            >
                                <img
                                    src={
                                        book.image_url ||
                                        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
                                    }
                                    alt={book.title}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {book.author || "Tidak diketahui"}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {book.publisher || "Tidak diketahui"}{" "}
                                        {book.year ? `(${book.year})` : ""}
                                    </p>

                                    {/* Stock */}
                                    <p
                                        className={`text-sm font-medium mb-2 ${
                                            book.stock > 0
                                                ? "text-green-600"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {book.stock > 0
                                            ? `Stok tersedia: ${book.stock}`
                                            : "Stok habis"}
                                    </p>

                                    {/* Price */}
                                    <p className="font-bold text-green-700 text-lg mb-3">
                                        Rp{" "}
                                        {book.price
                                            ? book.price.toLocaleString("id-ID")
                                            : "0"}
                                    </p>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                        {book.description ||
                                            "Tidak ada deskripsi."}
                                    </p>

                                    {/* Buttons */}
                                    <div className="space-y-2">
                                        <button
                                            onClick={() =>
                                                handleAddToCart(book.id)
                                            }
                                            disabled={book.stock === 0}
                                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg w-full transition"
                                        >
                                            {book.stock === 0
                                                ? "Stok Habis"
                                                : "Tambah ke Keranjang 🛒"}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleBuyNow(book.id)
                                            }
                                            disabled={book.stock === 0}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg w-full transition"
                                        >
                                            {book.stock === 0
                                                ? "Stok Habis"
                                                : "Beli Sekarang 💳"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
