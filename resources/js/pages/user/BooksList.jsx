import React, { useState } from "react";
import SidebarUser from "../../components/user/SidebarUser";

const BookList = () => {
    // State dark mode
    const [darkMode, setDarkMode] = useState(false);

    const books = [
        {
            id: 1,
            title: "Pemrograman Kotlin untuk Pemula",
            author: "Linda N. Fadilah",
            publisher: "TechPress",
            year: 2024,
            price: 75000,
            image_url:
                "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
            description:
                "Panduan lengkap belajar bahasa pemrograman Kotlin dari dasar hingga mahir.",
        },
        {
            id: 2,
            title: "Belajar Machine Learning",
            author: "Randika Putra",
            publisher: "AI Studio",
            year: 2023,
            price: 95000,
            image_url:
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            description:
                "Buku pengantar konsep dan penerapan Machine Learning menggunakan Python.",
        },
        {
            id: 3,
            title: "Data Mining untuk Pemula",
            author: "Ayu Lestari",
            publisher: "DataTech",
            year: 2022,
            price: 89000,
            image_url:
                "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d",
            description:
                "Dasar-dasar data mining dan implementasi model prediksi dengan dataset sederhana.",
        },
    ];

    return (
        <div className={`${darkMode ? "dark" : ""} flex min-h-screen bg-gray-50`}>
            {/* Sidebar */}
            <SidebarUser darkMode={darkMode} setDarkMode={setDarkMode} />

            {/* Konten utama */}
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-center text-green-700 mb-10">
                    📚 Daftar Buku Tersedia
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                            <img
                                src={book.image_url}
                                alt={book.title}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg">
                                    {book.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {book.author}
                                </p>
                                <p className="text-sm text-gray-500 mb-2">
                                    {book.publisher}
                                </p>
                                <p className="font-bold text-green-700 text-lg mb-3">
                                    Rp {book.price.toLocaleString("id-ID")}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                    {book.description}
                                </p>
                                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full transition">
                                    Tambah ke Keranjang 🛒
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default BookList;
