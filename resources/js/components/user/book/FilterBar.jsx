import React from "react";
import PropTypes from "prop-types";
import { Filter, ChevronDown } from "lucide-react";

const FilterBar = ({
    categories,
    selectedCategory,
    onCategoryChange,
    minPrice,
    maxPrice,
    onPriceChange,
    sortBy,
    onSortChange,
    onReset,
    resultCount,
    showMobileFilters,
    onToggleMobileFilters,
}) => (
    <>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Kategori:
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm min-w-[140px]"
                        >
                            <option value="all">Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Harga:
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={minPrice ? minPrice.toLocaleString("id-ID") : ""}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    onPriceChange({ min: Number(value) || 0, max: maxPrice });
                                }}
                                placeholder="Min"
                                className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="text"
                                value={maxPrice ? maxPrice.toLocaleString("id-ID") : ""}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    onPriceChange({ min: minPrice, max: Number(value) || 0 });
                                }}
                                placeholder="Max"
                                className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            Urutkan:
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm min-w-[140px]"
                        >
                            <option value="newest">Terbaru</option>
                            <option value="price_low">Harga Terendah</option>
                            <option value="price_high">Harga Tertinggi</option>
                            <option value="name">Nama A-Z</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-blue-600">{resultCount}</span> buku ditemukan
                    </div>
                    <button
                        onClick={onReset}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition font-medium whitespace-nowrap"
                    >
                        Reset Filter
                    </button>
                </div>
            </div>
            <button
                onClick={onToggleMobileFilters}
                className="lg:hidden flex items-center gap-2 w-full justify-center mt-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg font-medium"
            >
                <Filter className="w-4 h-4" />
                {showMobileFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${showMobileFilters ? "rotate-180" : ""}`}
                />
            </button>
        </div>

        {showMobileFilters && (
            <div className="lg:hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100 dark:border-gray-700">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Kategori
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="all">Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Rentang Harga
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={minPrice ? minPrice.toLocaleString("id-ID") : ""}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    onPriceChange({ min: Number(value) || 0, max: maxPrice });
                                }}
                                placeholder="Min"
                                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="text"
                                value={maxPrice ? maxPrice.toLocaleString("id-ID") : ""}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    onPriceChange({ min: minPrice, max: Number(value) || 0 });
                                }}
                                placeholder="Max"
                                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Urutkan Berdasarkan
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="newest">Terbaru</option>
                            <option value="price_low">Harga Terendah</option>
                            <option value="price_high">Harga Tertinggi</option>
                            <option value="name">Nama A-Z</option>
                        </select>
                    </div>
                </div>
            </div>
        )}
    </>
);

FilterBar.propTypes = {
    categories: PropTypes.array.isRequired,
    selectedCategory: PropTypes.string.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    minPrice: PropTypes.number.isRequired,
    maxPrice: PropTypes.number.isRequired,
    onPriceChange: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    onSortChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    resultCount: PropTypes.number.isRequired,
    showMobileFilters: PropTypes.bool.isRequired,
    onToggleMobileFilters: PropTypes.func.isRequired,
};

export default FilterBar;
