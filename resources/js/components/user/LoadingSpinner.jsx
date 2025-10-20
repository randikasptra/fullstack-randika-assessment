import React from 'react';

const LoadingBook = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center space-y-4">
                {/* Book Icon */}
                <div className="relative w-24 h-32">
                    {/* Book Cover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg transform -rotate-6 animate-pulse"></div>
                    {/* Pages */}
                    <div className="absolute inset-0 bg-white rounded-r-lg border-l-2 border-gray-200 transform -rotate-6"></div>
                    {/* Spine */}
                    <div className="absolute left-0 top-1 bottom-1 w-1 bg-blue-800 rounded-l"></div>
                </div>
                {/* Text */}
                <div className="text-center">
                    <p className="text-gray-600 font-medium">Memuat buku...</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingBook;
