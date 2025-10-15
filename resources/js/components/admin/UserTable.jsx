import React from "react";
import { Edit, Trash2, User, Shield, Mail, Hash } from "lucide-react";

const UserTable = ({ users = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>No</span>
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Nama</span>
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-green-100 text-green-700 border border-green-200"
                    }`}
                  >
                    {user.role === "admin" ? (
                      <Shield className="w-3 h-3 mr-1" />
                    ) : (
                      <User className="w-3 h-3 mr-1" />
                    )}
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Edit user"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="inline-flex items-center p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Hapus user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-600 mb-2">Tidak ada data user</p>
                  <p className="text-sm text-gray-500">Mulai dengan menambahkan user pertama</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
