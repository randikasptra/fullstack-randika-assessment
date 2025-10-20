import React from 'react';
import PropTypes from 'prop-types';
import { User, Shield, Mail } from 'lucide-react';

const ProfileHeader = ({ profile }) => (
    <header className="text-center mb-8" role="banner">
        <div className="relative inline-block" aria-label={`Profil ${profile.name || 'User'}`}>
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundImage: `url(${profile.avatar || ''})`, backgroundSize: 'cover' }}>
                {!profile.avatar && <User className="w-10 h-10 text-white" aria-hidden="true" />}
            </div>
            <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 border-2 border-white" aria-label="Akun terverifikasi">
                <Shield className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{profile.name || 'User'}</h1>
        <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2" aria-label="Deskripsi profil">
            <Mail className="w-4 h-4" aria-hidden="true" />
            {profile.email || 'Kelola informasi profil Anda'}
        </p>
    </header>
);

ProfileHeader.propTypes = {
    profile: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        avatar: PropTypes.string,
    }).isRequired,
};

export default ProfileHeader;
