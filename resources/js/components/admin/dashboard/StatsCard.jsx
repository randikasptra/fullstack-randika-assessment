import React from "react";
import PropTypes from "prop-types";
import { FaBook, FaUsers, FaShoppingCart, FaMoneyBillWave, FaUserPlus } from "react-icons/fa";

const StatsCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow" role="group">
        <div className="flex items-center">
            <div className={`p-3 ${color === 'blue' ? 'bg-blue-100' : color === 'indigo' ? 'bg-indigo-100' : color === 'green' ? 'bg-green-100' : color === 'yellow' ? 'bg-yellow-100' : 'bg-purple-100'} rounded-lg`}>
                <Icon className={`text-2xl ${color === 'blue' ? 'text-blue-600' : color === 'indigo' ? 'text-indigo-600' : color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`} aria-hidden="true" />
            </div>
            <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

StatsCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    color: PropTypes.oneOf(['blue', 'indigo', 'green', 'yellow', 'purple']).isRequired,
};

export default StatsCard;
