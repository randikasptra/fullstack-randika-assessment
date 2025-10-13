// resources/js/pages/user/BooksList.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NavbarUser from "../../components/user/NavbarUser";
import * as bookService from "../../services/user/bookService";

const BooksList = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("auth_token");
  const navigate = useNavigate();

  // 🔹 Toggle dark mode event listener
  useEffect(() => {
    const handleToggleDarkMode = () => setDarkMode(!darkMode);
    window.addEventListener("toggleDarkMode", handleToggleDarkMode);
    return () => window.removeEventListener("toggleDarkMode", handleToggleDarkMode);
  }, [darkMode]);

  // 🔹 Load user data
  useEffect(() => {
    if (!token) {
      toast.warn("Kamu belum login!");
      navigate("/");
      return;
    }

    const loadUser = async () => {
      const result = await bookService.fetchUser();
      if (result.success) {
        setUser(result.data);
      } else {
        if (result.unauthorized) {
          toast.error("Sesi login berakhir. Silakan login ulang.");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          navigate("/");
        } else {
          console.error("❌ Gagal memuat user:", result.error);
        }
      }
    };

    loadUser();
  }, [navigate, token]);

  // 🔹 Fetch buku dan kategori
  useEffect(() => {
    if (!token) {
      toast.warn("Kamu belum login!");
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        const [bookResult, categoryResult] = await Promise.all([
          bookService.fetchBooks(),
          bookService.fetchCategories(),
        ]);

        if (bookResult.success) {
          setBooks(bookResult.data);
          setFilteredBooks(bookResult.data);
        } else {
          toast.error(bookResult.error);
        }

        if (categoryResult.success) {
          setCategories(categoryResult.data);
        } else {
          // Jika kategori tidak tersedia (403), tetap lanjutkan tanpa filter kategori
          if (!categoryResult.needsPublicEndpoint) {
            console.warn("Kategori tidak tersedia:", categoryResult.error);
          }
          setCategories([]);
        }
      } catch (error) {
        toast.error("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate, token]);

  // 🔹 Filter & Search
  useEffect(() => {
    let filtered = books;
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (book) => book.category_id == selectedCategory
      );
    }
    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedCategory]);

  // 🔹 Tambah ke keranjang
  const handleAddToCart = async (bookId) => {
    const result = await bookService.addToCart(bookId);
    if (result.success) {
      toast.success("Buku ditambahkan ke keranjang!");
    } else {
      toast.error(result.error);
    }
  };

  // 🔹 Checkout
  const handleCheckout = async (bookId) => {
    const result = await bookService.addToCart(bookId);
    if (result.success) {
      toast.success("Buku ditambahkan ke keranjang!");
      navigate("/checkout");
    } else {
      toast.error(result.error);
    }
  };

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <NavbarUser darkMode={darkMode} user={user} />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-lg">Memuat buku...</div>
        </main>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-gray-900`}>
      <NavbarUser darkMode={darkMode} user={user} />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-10">
          📚 Daftar Buku Tersedia
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Cari buku berdasarkan judul atau penulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {book.author || "Tidak diketahui"}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {book.publisher || "Tidak diketahui"}{" "}
                  {book.year ? `(${book.year})` : ""}
                </p>
                <p className="font-bold text-green-700 text-lg mb-3">
                  Rp {book.price ? book.price.toLocaleString("id-ID") : "0"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {book.description || "Tidak ada deskripsi."}
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleAddToCart(book.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full transition"
                  >
                    Tambah ke Keranjang 🛒
                  </button>
                  <button
                    onClick={() => handleCheckout(book.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition"
                  >
                    Beli Sekarang 💳
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Jika tidak ada buku */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Tidak ada buku yang ditemukan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksList;
