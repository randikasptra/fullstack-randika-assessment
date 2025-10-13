// resources/js/pages/admin/SettingsAdmin.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { toast } from "react-toastify";
import * as settingsService from "../../services/admin/settingsService";

export default function SettingsAdmin() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const result = await settingsService.fetchProfile();

    if (result.success) {
      setUser(result.data.user);
      setName(result.data.user.name);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();

    const result = await settingsService.updateName(name);
    if (result.success) {
      setUser(result.data.user);
      toast.success(result.data.message);
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    const result = await settingsService.updatePassword(
      currentPassword,
      newPassword,
      confirmPassword
    );

    if (result.success) {
      toast.success("Password berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Pengaturan Akun</h1>
            <p className="text-gray-600 mt-2">Kelola informasi profil dan keamanan akun Anda</p>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {user && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200">
                <button
                  className={`px-6 py-4 font-medium text-sm transition-colors ${activeTab === "profile" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("profile")}
                >
                  Profil
                </button>
                <button
                  className={`px-6 py-4 font-medium text-sm transition-colors ${activeTab === "security" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("security")}
                >
                  Keamanan
                </button>
              </div>

              <div className="p-6">
                {/* Profile Information */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateName} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                          value={user.email}
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                      </div>
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                        >
                          Simpan Perubahan
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div className="mb-2">
                      <h2 className="text-xl font-semibold text-gray-800">Ubah Password</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Pastikan password Anda kuat dan unik
                      </p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password Baru
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Masukkan password baru"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Konfirmasi Password Baru
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Konfirmasi password baru"
                        />
                      </div>
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                        >
                          Ubah Password
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
