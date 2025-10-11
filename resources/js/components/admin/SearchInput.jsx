// js/components/admin/SearchInput.jsx
import React from "react";

const SearchInput = ({ onSearchChange, value }) => {
    return (
        <div className="relative max-w-md">
            <input
                type="text"
                value={value}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari kategori berdasarkan nama atau deskripsi..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
    );
};

export default SearchInput;
