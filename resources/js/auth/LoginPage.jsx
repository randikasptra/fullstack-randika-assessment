import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ---- Handle token dari Google OAuth ----
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);

      // opsional: bisa panggil API /me untuk dapat info user
      axios
        .get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const user = res.data;
          localStorage.setItem("user", JSON.stringify(user));

          toast.success("Login berhasil via Google 🎉");

          if (user.email === "admin@mail.com") navigate("/admin/dashboard");
          else navigate("/user/dashboard");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Gagal mendapatkan data user!");
        });
    }
  }, [location.search, navigate]);

  // ---- Login manual ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        { email, password }
      );

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login berhasil 🎉");

      if (user.email === "admin@mail.com") navigate("/admin/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Email atau password salah!");
    } finally {
      setLoading(false);
    }
  };

  // ---- Google OAuth ----
  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/auth/google"; // web.php route
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login ke Sistem
        </h2>

        {/* Form login manual */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center justify-between my-4">
          <hr className="w-1/3 border-gray-300" />
          <span className="text-gray-500 text-sm">atau</span>
          <hr className="w-1/3 border-gray-300" />
        </div>

        {/* Tombol Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Masuk dengan Google</span>
        </button>

        {/* Link register */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
