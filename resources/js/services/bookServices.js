// resources/js/services/bookServices.js
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

// 🔹 Endpoint dasar
const API_URL = `${API_BASE_URL}/api`;

// 🔹 Fetch semua buku
export const fetchBooks = async (token) => {
  const res = await axios.get(`${API_URL}/books`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🔹 Fetch semua kategori buku
export const fetchCategories = async (token) => {
  const res = await axios.get(`${API_URL}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🔹 Ambil data user login
export const fetchUser = async (token) => {
  const res = await axios.get(`${API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res.data;
};

// 🔹 Tambahkan buku ke keranjang
export const addToCart = async (bookId, token) => {
  const res = await axios.post(`${API_URL}/cart/add/${bookId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
