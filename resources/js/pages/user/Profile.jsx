import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Components
import UserLayout from "../../layouts/UserLayout";
import ProfileHeader from "../../components/user/ProfileHeader";
import ProfileInfoCard from "../../components/user/ProfileInfoCard";
import ChangePasswordCard from "../../components/user/ChangePasswordCard";
import LoadingSpinner from "../../components/user/LoadingSpinner";

// Services
import profileService from "../../services/user/profileService";

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [passwordData, setPasswordData] = useState({
        new_password: "",
        new_password_confirmation: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({});

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
            setPasswordData({ new_password: "", new_password_confirmation: "" });
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

        setPasswordErrors(validatePassword({ ...passwordData, [name]: value }));
    };

    const validatePassword = (data) => {
        const errors = {};
        const newPass = data.new_password;

        if (newPass.length > 0) {
            if (newPass.length < 8) {
                errors.new_password = "Minimal 8 karakter";
            }
            if (!/[a-z]/.test(newPass)) {
                errors.new_password = "Harus ada huruf kecil";
            }
            if (!/[A-Z]/.test(newPass)) {
                errors.new_password = "Harus ada huruf besar";
            }
            if (!/[0-9]/.test(newPass)) {
                errors.new_password = "Harus ada angka";
            }
        }

        if (data.new_password_confirmation && data.new_password_confirmation !== newPass) {
            errors.new_password_confirmation = "Konfirmasi password tidak cocok";
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
            toast.error("Perbaiki error password terlebih dahulu!");
            return;
        }

        try {
            const response = await profileService.changePassword(passwordData);
            if (response.success) {
                toast.success(response.message);
                setPasswordData({ new_password: "", new_password_confirmation: "" });
                setPasswordErrors({});
            } else {
                toast.error(response.message || "Gagal ubah password");
            }
        } catch (error) {
            if (error.errors) {
                const newErrors = {};
                if (error.errors.new_password) newErrors.new_password = error.errors.new_password[0];
                if (error.errors.new_password_confirmation) newErrors.new_password_confirmation = error.errors.new_password_confirmation[0];
                setPasswordErrors(newErrors);
                toast.error(error.errors.new_password?.[0] || error.errors.new_password_confirmation?.[0] || "Gagal ubah password");
            } else {
                toast.error(error.message || "Gagal ubah password");
            }
        }
    };

    // Placeholder profile data for skeleton
    const placeholderProfile = {
        name: "Memuat...",
        email: "memuat@example.com",
        phone: "",
        address: "",
        city: "",
        province: "",
        postal_code: ""
    };

    const displayProfile = loading ? placeholderProfile : profile;

    return (
        <UserLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="animate-pulse">
                        {/* Profile Header Skeleton */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Profile Information Skeleton */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Change Password Skeleton */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                <div className="h-5 bg-gray-200 rounded w-32 mb-6"></div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <ProfileHeader profile={displayProfile} />

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Profile Information */}
                            <div>
                                <ProfileInfoCard
                                    profile={displayProfile}
                                    editing={editing}
                                    saving={saving}
                                    onEditToggle={handleEditToggle}
                                    onProfileChange={handleProfileChange}
                                    onSave={handleSaveProfile}
                                />
                            </div>

                            {/* Change Password */}
                            <div>
                                <ChangePasswordCard
                                    passwordData={passwordData}
                                    passwordErrors={passwordErrors}
                                    onPasswordChange={handlePasswordChange}
                                    onChangePassword={handleChangePassword}
                                    saving={saving}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </UserLayout>
    );
}
