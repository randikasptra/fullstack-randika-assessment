import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Components
import UserLayout from "../../layouts/UserLayout";
import ProfileHeader from "../../components/user/profile/ProfileHeader";
import ProfileInfoCard from "../../components/user/profile/ProfileInfoCard";
import ChangePasswordCard from "../../components/user/profile/ChangePasswordCard";
import LoadingSpinner from "../../components/user/LoadingSpinner";

// Services
import profileService from "../../services/user/profileService";

// Custom hook for profile logic (reusable)
const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await profileService.getProfile();
            if (response.success) {
                setProfile(response.data);
                localStorage.setItem("user", JSON.stringify(response.data)); // Sync local
            } else {
                throw new Error(response.message || "Failed to fetch");
            }
        } catch (err) {
            setError(err.message);
            toast.error(err.message || "Gagal memuat profil");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, refetch: fetchProfile, updateLocal: setProfile };
};

export default function Profile() {
    const navigate = useNavigate();
    const { profile, loading, error, refetch, updateLocal } = useProfile();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [passwordData, setPasswordData] = useState({ new_password: "", new_password_confirmation: "" });
    const [passwordErrors, setPasswordErrors] = useState({});

    // Memoize display profile
    const displayProfile = useMemo(() => loading ? {
        name: "Memuat...", email: "memuat@example.com", phone: "", address: "", city: "", province: "", postal_code: ""
    } : profile || {}, [loading, profile]);

    const handleEditToggle = useCallback(() => {
        setEditing(prev => {
            if (prev) {
                setPasswordData({ new_password: "", new_password_confirmation: "" });
                setPasswordErrors({});
            }
            return !prev;
        });
    }, []);

    const handleProfileChange = useCallback((e) => {
        updateLocal(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, [updateLocal]);

    const handlePasswordChange = useCallback((e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        setPasswordErrors(validatePassword({ ...passwordData, [name]: value }));
    }, [passwordData]);

    const validatePassword = useCallback((data) => {
        const errors = {};
        const newPass = data.new_password;
        if (newPass.length > 0) {
            if (newPass.length < 8) errors.new_password = "Minimal 8 karakter";
            if (!/[a-z]/.test(newPass)) errors.new_password = "Harus ada huruf kecil";
            if (!/[A-Z]/.test(newPass)) errors.new_password = "Harus ada huruf besar";
            if (!/[0-9]/.test(newPass)) errors.new_password = "Harus ada angka";
        }
        if (data.new_password_confirmation && data.new_password_confirmation !== newPass) {
            errors.new_password_confirmation = "Konfirmasi tidak cocok";
        }
        return errors;
    }, []);

    const handleSaveProfile = useCallback(async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await profileService.updateProfile(displayProfile);
            if (response.success) {
                toast.success(response.message);
                setEditing(false);
                refetch(); // Refetch to sync
            } else {
                toast.error(response.message || "Gagal update");
            }
        } catch (error) {
            if (error.errors) {
                // Handle field errors
                toast.error(Object.values(error.errors)[0][0]);
            } else {
                toast.error(error.message || "Gagal update");
            }
        } finally {
            setSaving(false);
        }
    }, [displayProfile, refetch]);

    const handleChangePassword = useCallback(async (e) => {
        e.preventDefault();
        const fullErrors = validatePassword(passwordData);
        if (Object.keys(fullErrors).length > 0) {
            toast.error("Perbaiki error password!");
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
                setPasswordErrors(error.errors);
                toast.error(Object.values(error.errors)[0][0]);
            } else {
                toast.error(error.message || "Gagal ubah password");
            }
        }
    }, [passwordData, validatePassword]);

    if (error && !loading) {
        return <div className="text-center py-8">Error: {error}. <button onClick={refetch}>Retry</button></div>;
    }

    return (
        <UserLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <ProfileHeader profile={displayProfile} />
                        <div className="grid lg:grid-cols-2 gap-8">
                            <ProfileInfoCard
                                profile={displayProfile}
                                editing={editing}
                                saving={saving}
                                onEditToggle={handleEditToggle}
                                onProfileChange={handleProfileChange}
                                onSave={handleSaveProfile}
                            />
                            <ChangePasswordCard
                                passwordData={passwordData}
                                passwordErrors={passwordErrors}
                                onPasswordChange={handlePasswordChange}
                                onChangePassword={handleChangePassword}
                                saving={saving}
                            />
                        </div>
                    </>
                )}
            </div>
        </UserLayout>
    );
}

