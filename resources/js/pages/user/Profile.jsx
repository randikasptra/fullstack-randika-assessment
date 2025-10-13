import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Edit, Save, X, Mail, Phone, MapPin, Lock } from "lucide-react";
import { toast } from "react-toastify";
import profileService from "../../services/user/profileService";
import UserLayout from "../../layouts/UserLayout";

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({}); // State buat error real-time

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await profileService.getProfile();
            if (response.success) {
                setProfile(response.data);
            } else {
                toast.error("Gagal memuat profil");
                navigate("/user/dashboard");
            }
        } catch (error) {
            toast.error(error.message || "Gagal memuat profil");
            navigate("/user/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        setEditing(!editing);
        if (editing) {
            setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
            setPasswordErrors({});
        }
    };

    const handleProfileChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Real-time validation
        setPasswordErrors(validatePassword({ ...passwordData, [name]: value }));
    };

    // Helper buat validasi password real-time
    const validatePassword = (data) => {
        const errors = {};
        const newPass = data.new_password;

        if (newPass.length > 0) {
            if (newPass.length < 8) {
                errors.new_password = "Min 8 karakter";
            }
            if (!/[a-z]/.test(newPass)) {
                errors.new_password = "Harus ada huruf kecil (lowercase)";
            }
            if (!/[A-Z]/.test(newPass)) {
                errors.new_password = "Harus ada huruf besar (uppercase)";
            }
            if (!/[0-9]/.test(newPass)) {
                errors.new_password = "Harus ada angka";
            }
        }

        if (data.confirm_password && data.confirm_password !== newPass) {
            errors.confirm_password = "Konfirmasi tidak cocok";
        }

        return errors;
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await profileService.updateProfile(profile);
            if (response.success) {
                toast.success(response.message);
                setEditing(false);
                localStorage.setItem("user", JSON.stringify(response.data));
            } else {
                toast.error(response.message || "Gagal update profil");
            }
        } catch (error) {
            toast.error(error.message || "Gagal update profil");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const fullErrors = validatePassword(passwordData);
        if (Object.keys(fullErrors).length > 0) {
            toast.error("Perbaiki error password dulu!");
            return;
        }

        try {
            const response = await profileService.changePassword(passwordData);
            if (response.success) {
                toast.success(response.message);
                setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
                setPasswordErrors({});
            } else {
                toast.error(response.message || "Gagal ubah password");
            }
        } catch (error) {
            // Handle Laravel validation errors detail
            if (error.errors) {
                const newErrors = {};
                if (error.errors.new_password) newErrors.new_password = error.errors.new_password[0];
                if (error.errors.confirm_password) newErrors.confirm_password = error.errors.confirm_password[0];
                setPasswordErrors(newErrors);
                toast.error(error.errors.new_password?.[0] || "Gagal ubah password");
            } else {
                toast.error(error.message || "Gagal ubah password");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-600 dark:text-gray-400">Profil tidak ditemukan</p>
            </div>
        );
    }

    return (
        <UserLayout>
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <User className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profil Saya</h1>
                </div>

                {/* Profile Info Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Informasi Pribadi</h2>
                        <button
                            onClick={handleEditToggle}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
                        >
                            {editing ? "Batal" : "Edit"}
                            {editing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                        </button>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name || ""}
                                onChange={handleProfileChange}
                                disabled={!editing}
                                required
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                    editing ? "border-gray-300 dark:border-gray-600" : "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                                }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email || ""}
                                onChange={handleProfileChange}
                                disabled={!editing}
                                required
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                    editing ? "border-gray-300 dark:border-gray-600" : "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                                }`}
                            />
                        </div>

                        {/* Kalo kolom phone/address ada di DB, uncomment ini */}
                        {/*
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Nomor Telepon
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone || ""}
                                onChange={handleProfileChange}
                                disabled={!editing}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                    editing ? "border-gray-300 dark:border-gray-600" : "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                                }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Alamat
                            </label>
                            <textarea
                                name="address"
                                value={profile.address || ""}
                                onChange={handleProfileChange}
                                disabled={!editing}
                                rows="3"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                    editing ? "border-gray-300 dark:border-gray-600" : "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                                }`}
                            />
                        </div>
                        */}

                        {editing && (
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition font-semibold flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        )}
                    </form>
                </div>

                {/* Change Password Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Ubah Password
                    </h2>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password Saat Ini
                            </label>
                            <input
                                type="password"
                                name="current_password"
                                value={passwordData.current_password}
                                onChange={handlePasswordChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Masukkan password saat ini"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                name="new_password"
                                value={passwordData.new_password}
                                onChange={handlePasswordChange}
                                required
                                minLength="8"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                    passwordErrors.new_password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                                placeholder="Password baru (min 8 char, huruf besar/kecil, angka)"
                            />
                            {passwordErrors.new_password && (
                                <p className="text-red-500 text-xs mt-1">{passwordErrors.new_password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Konfirmasi Password Baru
                            </label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={passwordData.confirm_password}
                                onChange={handlePasswordChange}
                                required
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                    passwordErrors.confirm_password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                                placeholder="Konfirmasi password baru"
                            />
                            {passwordErrors.confirm_password && (
                                <p className="text-red-500 text-xs mt-1">{passwordErrors.confirm_password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={Object.keys(passwordErrors).length > 0 || !passwordData.new_password || saving}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition font-semibold"
                        >
                            Ubah Password
                        </button>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}
