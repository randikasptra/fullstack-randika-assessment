import React from "react";
import PropTypes from "prop-types";
import { ShoppingCart, Star, Heart, Share2 } from "lucide-react";

const BookCard = ({ book, onAddToCart, onBuyNow }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group">
        <div className="relative overflow-hidden">
            <img
                src={book.image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"}
                alt={book.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
            />
            {book.category?.name && (
                <div className="absolute top-3 left-3">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {book.category.name}
                    </span>
                </div>
            )}
            <div className="absolute top-3 right-3">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        book.stock > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}
                >
                    {book.stock > 0 ? "Tersedia" : "Habis"}
                </span>
            </div>
        </div>
        <div className="p-4">
            <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {book.rating || "N/A"}
                </span>
            </div>
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
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(book.price || 0)}
                </p>
                <p className="text-sm text-gray-500">Stok: {book.stock}</p>
            </div>
            <div className="flex gap-2 mb-3">
                <button
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Tambah ke Wishlist"
                >
                    <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Bagikan"
                >
                    <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onAddToCart(book.id)}
                    disabled={book.stock === 0}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    aria-label={`Tambah ${book.title} ke keranjang`}
                >
                    <ShoppingCart className="w-4 h-4" />
                    Keranjang
                </button>
                <button
                    onClick={() => onBuyNow(book.id)}
                    disabled={book.stock === 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                    aria-label={`Beli sekarang ${book.title}`}
                >
                    Beli
                </button>
            </div>
        </div>
    </div>
);

BookCard.propTypes = {
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        author: PropTypes.string,
        price: PropTypes.number,
        stock: PropTypes.number,
        image_url: PropTypes.string,
        category: PropTypes.shape({ name: PropTypes.string }),
        publisher: PropTypes.string,
        year: PropTypes.number,
        description: PropTypes.string,
        rating: PropTypes.number,
    }).isRequired,
    onAddToCart: PropTypes.func.isRequired,
    onBuyNow: PropTypes.func.isRequired,
};

export default BookCard;
