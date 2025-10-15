import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
