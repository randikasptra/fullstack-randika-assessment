// resources/js/pages/users/BooksList.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bookService from "../../services/user/bookService";
import cartService from "../../services/user/cartService";
import {
    Search,
    ShoppingCart,
    BookOpen,
    Filter,
    X,
    Plus,
    Minus,
    Trash2,
    CheckCircle,
    ChevronDown,
} from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import echo from '../../../lib/echo'; // Import Echo
import { toast } from 'react-toastify';

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
    const [cartItems, setCartItems] = useState([]);
    const [showFloatingCart, setShowFloatingCart] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [lastAddedBook, setLastAddedBook] = useState(null);

    const navigate = useNavigate();
    const subscribedChannels = useRef(new Set());

    // Load books on mount
    useEffect(() => {
        let isMounted = true;

        const loadBooks = async () => {
            try {
                setLoading(true);
                const response = await bookService.getAllBooks();
                const booksData = Array.isArray(response) ? response : response.data || [];

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
        };
    }, []);

    // ✅ FIXED: WebSocket setup sekali saja, setelah books loaded (one-time init)
    useEffect(() => {
        if (books.length === 0) return;

        // Setup hanya jika belum diinisialisasi
        if (subscribedChannels.current.size > 0) return;

        console.log('🔊 User: Setting up WebSocket for', books.length, 'books (one-time init)');
        console.log('📋 User: Book IDs:', books.map(b => b.id));

        books.forEach((book) => {
            const channelName = `products.${book.id}`;

            console.log(`🔌 User: Subscribing to ${channelName}...`);

            const channel = echo.channel(channelName);

            channel.subscribed(() => {
                console.log(`✅ User: Successfully subscribed to ${channelName}`);
            });

            channel.error((error) => {
                console.error(`❌ User: Error on ${channelName}:`, error);
            });

            // Listen for stock updates
            channel.listen('.stock.updated', (data) => {
                console.log(`📦 User: Stock updated for book ${data.id}:`, data);

                // Update book in real-time
                setBooks((prevBooks) => {
                    const updated = prevBooks.map((b) =>
                        b.id === data.id
                            ? { ...b, stock: data.stock, title: data.title }
                            : b
                    );
                    console.log('🔄 User: Books updated in state');
                    return updated;
                });

                // Optional: Show toast
                toast.info(`${data.title} - Stock: ${data.stock}`, {
                    position: "bottom-right",
                    autoClose: 2000
                });
            });

            subscribedChannels.current.add(channelName);
        });

        console.log('📡 User: Active channels:', Array.from(subscribedChannels.current));

        // Cleanup hanya saat unmount component
        return () => {
            console.log('👋 User: Cleaning up WebSocket channels on unmount');
            subscribedChannels.current.forEach((channelName) => {
                echo.leave(channelName);
                console.log(`❌ User: Left ${channelName}`);
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
                console.log(`➕ User: Adding new subscription for ${channelName}`);
                const channel = echo.channel(channelName);

                channel.subscribed(() => {
                    console.log(`✅ User: Added subscription to ${channelName}`);
                });

                channel.error((error) => {
                    console.error(`❌ User: Error on ${channelName}:`, error);
                });

                // Listen for stock updates (sama seperti di atas)
                channel.listen('.stock.updated', (data) => {
                    console.log(`📦 User: Stock updated for book ${data.id}:`, data);

                    setBooks((prevBooks) => {
                        const updated = prevBooks.map((b) =>
                            b.id === data.id
                                ? { ...b, stock: data.stock, title: data.title }
                                : b
                        );
                        console.log('🔄 User: Books updated in state');
                        return updated;
                    });

                    toast.info(`${data.title} - Stock: ${data.stock}`, {
                        position: "bottom-right",
                        autoClose: 2000
                    });
                });

                subscribedChannels.current.add(channelName);
            }
        });

        // Unsubscribe channel lama yang buku-nya sudah dihapus
        const currentIds = new Set(books.map(b => `products.${b.id}`));
        subscribedChannels.current.forEach((channelName) => {
            if (!currentIds.has(channelName)) {
                console.log(`➖ User: Removing old subscription ${channelName}`);
                echo.leave(channelName);
                subscribedChannels.current.delete(channelName);
            }
        });
    }, [books.length]); // Re-run hanya jika jumlah books berubah (add/delete)

    // Apply filters
    useEffect(() => {
        let filtered = [...books];
        if (searchQuery) {
            filtered = filtered.filter(
                (book) =>
                    book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.publisher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
            const existingItem = cartItems.find((item) => item.book.id === bookId);

            if (existingItem) {
                const newQuantity = existingItem.quantity + 1;
                setCartItems((prev) =>
                    prev.map((item) =>
                        item.book.id === bookId
                            ? { ...item, quantity: newQuantity }
                            : item
                    )
                );
            } else {
                const newItem = {
                    id: Date.now(),
                    book: book,
                    quantity: 1,
                };
                setCartItems((prev) => [...prev, newItem]);
            }

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
        navigate("/user/cart");
    };

    const handleCheckout = async () => {
        try {
            for (const item of cartItems) {
                await cartService.addToCart(item.book.id, item.quantity);
            }
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
                        <span className="font-medium text-sm">Ditambahkan!</span>
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

                {/* Filters - Keep existing filter UI */}
                {/* ... rest of the filter code stays the same ... */}

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
                                <div className="relative overflow-hidden">
                                    <img
                                        src={
                                            book.image_url ||
                                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
                                        }
                                        alt={book.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {book.category?.name && (
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                {book.category.name}
                                            </span>
                                        </div>
                                    )}

                                    {/* Real-time Stock Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                book.stock > 0
                                                    ? "bg-green-500 text-white"
                                                    : "bg-red-500 text-white"
                                            }`}
                                        >
                                            {book.stock > 0 ? "Tersedia" : "Habis"}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {book.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        {book.author || "Penulis tidak diketahui"}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                                        {book.publisher} {book.year && `• ${book.year}`}
                                    </p>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                        {book.description || "Tidak ada deskripsi yang tersedia."}
                                    </p>

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

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(book.id)}
                                            disabled={book.stock === 0}
                                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Keranjang
                                        </button>
                                        <button
                                            onClick={() => handleBuyNow(book.id)}
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

                {/* Floating Cart - Keep existing floating cart code */}
                {/* ... rest of the floating cart code stays the same ... */}
            </div>
        </UserLayout>
    );
}
