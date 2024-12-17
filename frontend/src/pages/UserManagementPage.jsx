import React, { useState } from 'react';

const UserManagementPage = () => {
  // membres pour test
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Merveille', role: 'Administrator', email: 'alice@example.com', status: 'Active' },
    { id: 2, name: 'Bob Eponge', role: 'Viewer', email: 'bob@example.com', status: 'Active' },
    { id: 3, name: 'Charles Chaplin', role: 'Moderator', email: 'charles@example.com', status: 'Inactive' },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    user.status === 'Active' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {user.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
