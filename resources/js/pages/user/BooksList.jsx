import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookService from "../../services/user/bookService";
import cartService from "../../services/user/cartService";
import { Search, ShoppingCart, BookOpen, Tag, Filter, ChevronDown } from "lucide-react";  // Tambah Filter & ChevronDown
import UserLayout from "../../layouts/UserLayout";

export default function BooksList() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000);  // Default max Rp 1jt
    const [sortBy, setSortBy] = useState("newest");  // newest, price_low, price_high, name

    // Unique categories dari books
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadBooks();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, selectedCategory, minPrice, maxPrice, sortBy]);

    const loadBooks = async () => {
        try {
            setLoading(true);
            const response = await bookService.getAllBooks();

            console.log("Full response:", response); // Debug

            // Handle jika response adalah object dengan property data
            let booksData = [];
            if (response && typeof response === "object") {
                if (Array.isArray(response)) {
                    booksData = response;
                } else if (response.data && Array.isArray(response.data)) {
                    booksData = response.data;
                }
            }

            setBooks(booksData);

            // Extract unique categories
            const uniqueCats = [...new Set(booksData.map(book => book.category?.name).filter(name => name))];
            setCategories(uniqueCats);

            setFilteredBooks(booksData);
        } catch (error) {
            console.error("Error loading books:", error);
            alert(error.message || "Gagal memuat buku");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...books];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (book) =>
                    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.publisher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== "all") {
            filtered = filtered.filter(book => book.category?.name === selectedCategory);
        }

        // Price filter
        filtered = filtered.filter(book =>
            (book.price || 0) >= minPrice && (book.price || 0) <= maxPrice
        );

        // Sort
        switch (sortBy) {
            case "price_low":
                filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case "price_high":
                filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case "name":
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "newest":
            default:
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
        }

        setFilteredBooks(filtered);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddToCart = async (bookId) => {
        try {
            const response = await cartService.addToCart(bookId, 1);
            if (response.success) {
                alert("Berhasil ditambahkan ke keranjang! 🛒");
                navigate("/user/cart");
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

    const resetFilters = () => {
        setSelectedCategory("all");
        setMinPrice(0);
        setMaxPrice(1000000);
        setSortBy("newest");
        setSearchQuery("");
    };

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

                <div className="md:flex gap-8">
                    {/* Filter Sidebar */}
                    <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 md:mb-0 sticky top-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filter
                        </h2>

                        {/* Category Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kategori
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Harga (Rp)
                            </label>
                            <div className="space-y-2">
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                                    placeholder="Min"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value) || 1000000)}
                                    placeholder="Max"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Sort By */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Urutkan
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="newest">Terbaru</option>
                                <option value="price_low">Harga Terendah</option>
                                <option value="price_high">Harga Tertinggi</option>
                                <option value="name">Nama A-Z</option>
                            </select>
                        </div>

                        {/* Reset & Apply Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={resetFilters}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition text-sm"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => applyFilters()}  // Manual apply kalau mau, tapi auto via useEffect
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
                            >
                                Terapkan
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Cari buku berdasarkan judul, penulis, penerbit, atau kategori..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Books Grid */}
                        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                            <span>Ditemukan {filteredBooks.length} buku</span>
                        </div>
                        {filteredBooks.length === 0 ? (
                            <div className="text-center py-16">
                                <BookOpen className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Tidak Ada Buku
                                </h2>
                                <p className="text-gray-500">
                                    {searchQuery || loading
                                        ? "Sedang memuat buku..."
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
                                            <p className="text-sm text-gray-500 mb-1">
                                                {book.publisher || "Tidak diketahui"}{" "}
                                                {book.year ? `(${book.year})` : ""}
                                            </p>

                                            {/* Tambah Category Badge */}
                                            {book.category && book.category.name && (
                                                <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 mb-2">
                                                    <Tag className="w-3 h-3" />
                                                    <span>Kategori: {book.category.name}</span>
                                                </div>
                                            )}

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
                </div>
            </div>
        </UserLayout>
    );
}
