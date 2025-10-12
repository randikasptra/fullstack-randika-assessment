import React from "react";
import { FaEdit, FaTrashAlt, FaUserShield, FaUser } from "react-icons/fa";

const UserTable = ({ users = [], onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Table Header */}
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {["No", "Nama", "Email", "Role", "Aksi"].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    }`}
                  >
                    {user.role === "admin" ? (
                      <FaUserShield className="mr-1" />
                    ) : (
                      <FaUser className="mr-1" />
                    )}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
                  <button
                    onClick={() => onEdit(user)}
                    className="flex items-center text-indigo-600 hover:text-indigo-900 transition"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="flex items-center text-red-600 hover:text-red-900 transition"
                  >
                    <FaTrashAlt className="mr-1" /> Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="text-center py-6 text-gray-500 dark:text-gray-400"
              >
                Tidak ada data user.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
