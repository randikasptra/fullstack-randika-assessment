// resources/js/utils/axios.js
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const instance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ Token tidak ditemukan di localStorage!");
  }
  return config;
});

export default instance;
