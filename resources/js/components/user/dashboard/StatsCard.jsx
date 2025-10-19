import React from "react";
import PropTypes from "prop-types";

const StatsCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
            <Icon className={`w-8 h-8 ${color}`} aria-hidden="true" />
        </div>
    </div>
);

StatsCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    color: PropTypes.string.isRequired,
};

StatsCard.defaultProps = {
    color: "text-gray-600",
};

export default StatsCard;
