// js/components/admin/SearchInput.jsx
import React from "react";
import { Search } from "lucide-react";

const SearchInput = ({ onSearchChange, value, placeholder = "Cari..." }) => {
    return (
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
};

export default SearchInput;
