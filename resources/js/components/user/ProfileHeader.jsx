import React from 'react';
import { User, Shield, Mail } from 'lucide-react';

const ProfileHeader = () => {
    return (
        <div className="text-center mb-8">
            <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <User className="w-10 h-10 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 border-2 border-white">
                    <Shield className="w-4 h-4 text-white" />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Profil Saya
            </h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Kelola informasi profil Anda
            </p>
        </div>
    );
};

export default ProfileHeader;
