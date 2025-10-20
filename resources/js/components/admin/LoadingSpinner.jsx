import React from "react";

const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="ml-4 text-gray-500">Memuat dashboard...</p>
    </div>
);

export default LoadingSpinner;
