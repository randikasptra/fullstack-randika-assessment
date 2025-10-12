import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Interceptor: otomatis kirim Authorization header
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("Token tidak ditemukan di localStorage!");
  }
  return config;
});

export default instance;
