import axios from "axios";
import { toast } from "react-toastify";

export const logoutUser = async (navigate, apiUrl = import.meta.env.VITE_API_URL) => {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    toast.warn("Kamu belum login!");
    navigate("/");
    return;
  }

  try {
    await axios.post(
      `${apiUrl}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    toast.success("Logout berhasil 👋");
    navigate("/");
  } catch (error) {
    console.error("Logout gagal:", error);

    if (error.response && error.response.status === 401) {
      toast.error("Sesi habis, silakan login kembali.");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      navigate("/");
    } else {
      toast.error("Gagal logout. Silakan coba lagi.");
    }
  }
};
