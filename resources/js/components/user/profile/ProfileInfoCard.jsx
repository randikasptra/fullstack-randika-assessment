import React from 'react';
import { Edit, Save, X, User, Mail } from 'lucide-react';

const ProfileInfoCard = ({
    profile,
    editing,
    saving,
    onEditToggle,
    onProfileChange,
    onSave
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-all duration-300 hover:shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Informasi Pribadi
                    </h2>
                </div>
                <button
                    onClick={onEditToggle}
                    className={`flex items-center gap-2 font-medium transition-all duration-200 px-4 py-2 rounded-lg ${
                        editing
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'
                    }`}
                >
                    {editing ? (
                        <>
                            <X className="w-4 h-4" />
                            Batal
                        </>
                    ) : (
                        <>
                            <Edit className="w-4 h-4" />
                            Edit Profil
                        </>
                    )}
                </button>
            </div>

            <form onSubmit={onSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Nama Lengkap
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                value={profile.name || ""}
                                onChange={onProfileChange}
                                disabled={!editing}
                                required
                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-white ${
                                    editing
                                        ? "border-gray-300 dark:border-gray-600 bg-white"
                                        : "bg-gray-50 dark:bg-gray-600 border-gray-200 dark:border-gray-500 cursor-not-allowed"
                                }`}
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Alamat Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={profile.email || ""}
                                onChange={onProfileChange}
                                disabled={!editing}
                                required
                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:text-white ${
                                    editing
                                        ? "border-gray-300 dark:border-gray-600 bg-white"
                                        : "bg-gray-50 dark:bg-gray-600 border-gray-200 dark:border-gray-500 cursor-not-allowed"
                                }`}
                            />
                        </div>
                    </div>
                </div>

                {editing && (
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                )}
            </form>
        </div>
    );
};

export default ProfileInfoCard;
