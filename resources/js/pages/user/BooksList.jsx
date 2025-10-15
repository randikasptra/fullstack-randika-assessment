// resources/js/pages/users/BooksList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookService from "../../services/user/bookService";
import cartService from "../../services/user/cartService";
import {
    Search,
    ShoppingCart,
    BookOpen,
    Tag,
    Filter,
    X,
    Plus,
    Minus,
    Trash2,
    CheckCircle,
    Star,
    Heart,
    Share2,
    ChevronDown,
} from "lucide-react";
import UserLayout from "../../layouts/UserLayout";

export default function BooksList() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000);
    const [sortBy, setSortBy] = useState("newest");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Floating cart states
    const [cartItems, setCartItems] = useState([]);
    const [showFloatingCart, setShowFloatingCart] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [lastAddedBook, setLastAddedBook] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const loadBooks = async () => {
            try {
                setLoading(true);
                const response = await bookService.getAllBooks();
                const booksData = Array.isArray(response)
                    ? response
                    : response.data || [];

                if (isMounted) {
                    setBooks(booksData);
                    setFilteredBooks(booksData);
                    const uniqueCats = [
                        ...new Set(
                            booksData
                                .map((book) => book.category?.name)
                                .filter((name) => name)
                        ),
                    ];
                    setCategories(uniqueCats);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error loading books:", error);
                    alert(error.message || "Gagal memuat buku");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadBooks();

        return () => {
            isMounted = false;
            if (window.Echo) {
                books.forEach((book) => {
                    window.Echo.leaveChannel(`products.${book.id}`);
                });
            }
        };
    }, []);

    useEffect(() => {
        if (!books.length || !window.Echo) return;

        let retryCount = 0;
        const maxRetries = 5;

        const setupWebSocket = () => {
            if (window.Echo.connector.pusher.connection.state === "connected") {
                books.forEach((book) => {
                    window.Echo.channel(`products.${book.id}`).listen(
                        ".stock.updated",
                        (data) => {
                            setBooks((prevBooks) =>
                                prevBooks.map((b) =>
                                    b.id === data.id
                                        ? { ...b, stock: data.stock }
                                        : b
                                )
                            );
                            console.log(
                                `Stock updated for ${data.title}: ${data.stock}`
                            );
                        }
                    );
                    console.log(`Subscribed to channel products.${book.id}`);
                });
            } else if (retryCount < maxRetries) {
                retryCount++;
                console.warn(
                    `WebSocket not connected. Retrying (${retryCount}/${maxRetries})...`
                );
                setTimeout(setupWebSocket, 1000);
            } else {
                console.error(
                    "Failed to connect to WebSocket after max retries"
                );
            }
        };

        setupWebSocket();

        return () => {
            if (window.Echo) {
                books.forEach((book) => {
                    window.Echo.leaveChannel(`products.${book.id}`);
                });
            }
        };
    }, [books]);

    useEffect(() => {
        let filtered = [...books];
        if (searchQuery) {
            filtered = filtered.filter(
                (book) =>
                    book.title
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    book.author
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    book.publisher
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    book.category?.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }
        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (book) => book.category?.name === selectedCategory
            );
        }
        filtered = filtered.filter(
            (book) =>
                (book.price || 0) >= minPrice && (book.price || 0) <= maxPrice
        );
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
                filtered.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                break;
        }
        setFilteredBooks(filtered);
    }, [books, searchQuery, selectedCategory, minPrice, maxPrice, sortBy]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddToCart = async (bookId) => {
        try {
            const book = books.find((b) => b.id === bookId);

            // Check if item already in cart
            const existingItem = cartItems.find(
                (item) => item.book.id === bookId
            );

            if (existingItem) {
                // Update quantity
                const newQuantity = existingItem.quantity + 1;
                setCartItems((prev) =>
                    prev.map((item) =>
                        item.book.id === bookId
                            ? { ...item, quantity: newQuantity }
                            : item
                    )
                );
            } else {
                // Add new item to cart
                const newItem = {
                    id: Date.now(), // temporary ID
                    book: book,
                    quantity: 1,
                };
                setCartItems((prev) => [...prev, newItem]);
            }

            // Show success toast
            setLastAddedBook(book);
            setShowSuccessToast(true);
            setShowFloatingCart(true);

            setTimeout(() => {
                setShowSuccessToast(false);
            }, 2000);
        } catch (error) {
            alert(error.message || "Gagal menambahkan ke keranjang");
        }
    };

    const handleUpdateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveFromCart(itemId);
            return;
        }

        setCartItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleRemoveFromCart = (itemId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        if (cartItems.length <= 1) {
            setShowFloatingCart(false);
        }
    };

    const handleClick = () => {
        navigate("/user/cart"); // pindah ke halaman cart
    };
    const handleCheckout = async () => {
        try {
            // Save all items to backend cart first
            for (const item of cartItems) {
                await cartService.addToCart(item.book.id, item.quantity);
            }

            // Navigate to cart page
            navigate("/user/cart");
        } catch (error) {
            alert(error.message || "Gagal melanjutkan ke checkout");
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

    const getTotalItems = () => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cartItems.reduce(
            (sum, item) => sum + item.book.price * item.quantity,
            0
        );
    };

    return (
        <UserLayout>
            <div className="pb-24">
                {/* Success Toast */}
                {showSuccessToast && lastAddedBook && (
                    <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium text-sm">
                            Ditambahkan!
                        </span>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Katalog Buku
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Temukan buku favorit Anda
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClick}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl relative"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Keranjang</span>
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {getTotalItems()}
                            </span>
                        )}
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Cari buku berdasarkan judul, penulis, penerbit, atau kategori..."
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white shadow-lg transition-all"
                        />
                    </div>
                </div>

                {/* Horizontal Filter Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left side - Filter controls */}
                        <div className="flex flex-wrap items-center gap-4 flex-1">
                            {/* Category Filter */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    Kategori:
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(e.target.value)
                                    }
                                    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm min-w-[140px]"
                                >
                                    <option value="all">Semua Kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range Filter */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    Harga:
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={
                                            minPrice
                                                ? minPrice.toLocaleString(
                                                      "id-ID"
                                                  )
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            setMinPrice(Number(value) || 0);
                                        }}
                                        placeholder="Min"
                                        className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="text"
                                        value={
                                            maxPrice
                                                ? maxPrice.toLocaleString(
                                                      "id-ID"
                                                  )
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            setMaxPrice(Number(value) || 0);
                                        }}
                                        placeholder="Max"
                                        className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    Urutkan:
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm min-w-[140px]"
                                >
                                    <option value="newest">Terbaru</option>
                                    <option value="price_low">
                                        Harga Terendah
                                    </option>
                                    <option value="price_high">
                                        Harga Tertinggi
                                    </option>
                                    <option value="name">Nama A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Right side - Results count and reset */}
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-blue-600">
                                    {filteredBooks.length}
                                </span>{" "}
                                buku ditemukan
                            </div>
                            <button
                                onClick={resetFilters}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition font-medium whitespace-nowrap"
                            >
                                Reset Filter
                            </button>
                        </div>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="lg:hidden flex items-center gap-2 w-full justify-center mt-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg font-medium"
                    >
                        <Filter className="w-4 h-4" />
                        {showMobileFilters
                            ? "Sembunyikan Filter"
                            : "Tampilkan Filter"}
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                                showMobileFilters ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                </div>

                {/* Mobile Filters Dropdown */}
                {showMobileFilters && (
                    <div className="lg:hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100 dark:border-gray-700">
                        <div className="space-y-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Kategori
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="all">Semua Kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Rentang Harga
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={
                                            minPrice
                                                ? minPrice.toLocaleString(
                                                      "id-ID"
                                                  )
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            setMinPrice(Number(value) || 0);
                                        }}
                                        placeholder="Min"
                                        className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="text"
                                        value={
                                            maxPrice
                                                ? maxPrice.toLocaleString(
                                                      "id-ID"
                                                  )
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            setMaxPrice(Number(value) || 0);
                                        }}
                                        placeholder="Max"
                                        className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Urutkan Berdasarkan
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="newest">Terbaru</option>
                                    <option value="price_low">
                                        Harga Terendah
                                    </option>
                                    <option value="price_high">
                                        Harga Tertinggi
                                    </option>
                                    <option value="name">Nama A-Z</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                        <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Tidak Ada Buku Ditemukan
                        </h2>
                        <p className="text-gray-500">
                            {searchQuery || loading
                                ? "Sedang memuat buku..."
                                : "Coba ubah filter pencarian Anda"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group"
                            >
                                {/* Book Image */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={
                                            book.image_url ||
                                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
                                        }
                                        alt={book.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {/* Category Badge */}
                                    {book.category?.name && (
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                {book.category.name}
                                            </span>
                                        </div>
                                    )}

                                    {/* Stock Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                book.stock > 0
                                                    ? "bg-green-500 text-white"
                                                    : "bg-red-500 text-white"
                                            }`}
                                        >
                                            {book.stock > 0
                                                ? "Tersedia"
                                                : "Habis"}
                                        </span>
                                    </div>
                                </div>

                                {/* Book Content */}
                                <div className="p-4">
                                    {/* Rating */}

                                    {/* Title */}
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {book.title}
                                    </h3>

                                    {/* Author & Publisher */}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        {book.author ||
                                            "Penulis tidak diketahui"}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                                        {book.publisher}{" "}
                                        {book.year && `• ${book.year}`}
                                    </p>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                        {book.description ||
                                            "Tidak ada deskripsi yang tersedia."}
                                    </p>

                                    {/* Price */}
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-2xl font-bold text-green-600">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                            }).format(book.price || 0)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Stok: {book.stock}
                                        </p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleAddToCart(book.id)
                                            }
                                            disabled={book.stock === 0}
                                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Keranjang
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleBuyNow(book.id)
                                            }
                                            disabled={book.stock === 0}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                                        >
                                            Beli
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Floating Cart */}
                {showFloatingCart && cartItems.length > 0 && (
                    <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40 max-h-96 overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-gray-900 dark:text-white">
                                    Keranjang ({getTotalItems()})
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowFloatingCart(false)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-48">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl"
                                >
                                    <img
                                        src={
                                            item.book.image_url ||
                                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
                                        }
                                        alt={item.book.title}
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                            {item.book.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                            }).format(item.book.price)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                handleUpdateQuantity(
                                                    item.id,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="w-6 h-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded flex items-center justify-center"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 text-center font-semibold text-gray-900 dark:text-white text-sm">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleUpdateQuantity(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="w-6 h-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded flex items-center justify-center"
                                            disabled={
                                                item.quantity >= item.book.stock
                                            }
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleRemoveFromCart(item.id)
                                            }
                                            className="ml-1 text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">
                                    Total:
                                </span>
                                <span className="text-lg font-bold text-green-700 dark:text-green-500">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                    }).format(getTotalPrice())}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate("/user/cart")}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition font-semibold"
                                >
                                    Lihat Detail
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition font-semibold"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
