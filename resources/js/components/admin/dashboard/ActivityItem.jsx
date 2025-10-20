import React from "react";
import PropTypes from "prop-types";

const ActivityItem = ({ activity }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100" role="logitem">
        <div className="flex items-center">
            <span className="text-2xl mr-4" aria-hidden="true">
                {activity.type === "order" ? "🛒" : "👤"}
            </span>
            <div>
                <p className="font-medium text-gray-800">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
            </div>
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap ml-4" aria-label={`Waktu: ${activity.time}`}>
            {activity.time}
        </span>
    </div>
);

ActivityItem.propTypes = {
    activity: PropTypes.shape({
        type: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        time: PropTypes.string,
    }).isRequired,
};

export default ActivityItem;
