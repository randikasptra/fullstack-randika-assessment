import React from 'react';
import { Lock, Key, Eye, EyeOff } from 'lucide-react';

const ChangePasswordCard = ({
    passwordData,
    passwordErrors,
    onPasswordChange,
    onChangePassword,
    saving
}) => {
    const [showPassword, setShowPassword] = React.useState({
        new_password: false,
        new_password_confirmation: false
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, color: 'bg-gray-200', text: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const strengths = [
            { color: 'bg-red-500', text: 'Sangat Lemah' },
            { color: 'bg-red-400', text: 'Lemah' },
            { color: 'bg-yellow-500', text: 'Cukup' },
            { color: 'bg-blue-500', text: 'Kuat' },
            { color: 'bg-green-500', text: 'Sangat Kuat' }
        ];

        return strengths[strength] || strengths[0];
    };

    const passwordStrength = getPasswordStrength(passwordData.new_password);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Keamanan Akun
                </h2>
            </div>

            <form onSubmit={onChangePassword} className="space-y-6">
                <div className="space-y-4">
                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Password Baru
                        </label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showPassword.new_password ? "text" : "password"}
                                name="new_password"
                                value={passwordData.new_password}
                                onChange={onPasswordChange}
                                required
                                minLength="8"
                                className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 dark:bg-gray-700 dark:text-white ${
                                    passwordErrors.new_password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                                placeholder="Masukkan password baru"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new_password')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword.new_password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {passwordData.new_password && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 dark:text-gray-400">Kekuatan password:</span>
                                    <span className={`font-semibold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                        {passwordStrength.text}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                        style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {passwordErrors.new_password && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                {passwordErrors.new_password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Konfirmasi Password Baru
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showPassword.new_password_confirmation ? "text" : "password"}
                                name="new_password_confirmation"
                                value={passwordData.new_password_confirmation}
                                onChange={onPasswordChange}
                                required
                                className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 dark:bg-gray-700 dark:text-white ${
                                    passwordErrors.new_password_confirmation ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                                placeholder="Konfirmasi password baru"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new_password_confirmation')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword.new_password_confirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {passwordErrors.new_password_confirmation && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                {passwordErrors.new_password_confirmation}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={Object.keys(passwordErrors).length > 0 || !passwordData.new_password || saving}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {saving ? "Mengubah Password..." : "Ubah Password"}
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordCard;
