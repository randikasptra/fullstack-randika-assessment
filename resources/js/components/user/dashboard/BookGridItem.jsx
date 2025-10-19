import React from "react";
import PropTypes from "prop-types";

const BookGridItem = ({ book, isPopular = false }) => (
    <div className="text-center">
        <img
            src={book.image_url || "https://via.placeholder.com/150?text=No+Image"}
            alt={`${book.title} by ${book.author}`}
            className="w-full h-32 object-cover rounded-lg mb-2 bg-gray-200"
            loading="lazy"
        />
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
            {book.title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {book.author}
        </p>
        {isPopular ? (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Dibeli {book.total_purchased}x
            </p>
        ) : (
            <p className="text-sm font-bold text-green-600">
                Rp {book.price?.toLocaleString("id-ID") || 0}
            </p>
        )}
    </div>
);

BookGridItem.propTypes = {
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        author: PropTypes.string,
        image_url: PropTypes.string,
        price: PropTypes.number,
        total_purchased: PropTypes.number,
    }).isRequired,
    isPopular: PropTypes.bool,
};

export default BookGridItem;
