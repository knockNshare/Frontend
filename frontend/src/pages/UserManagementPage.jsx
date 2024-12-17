import React, { useState } from 'react';
import AddUserForm from '../components/AddUserForm';

const UserManagementPage = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'Alice Merveille', role: 'Administrateur', email: 'alice@example.com', status: 'Active' },
        { id: 2, name: 'Bob Eponge', role: 'Membre', email: 'bob@example.com', status: 'Active' },
        { id: 3, name: 'Charles Chaplin', role: 'Modérateur', email: 'charles@example.com', status: 'Inactive' },
        { id: 4, name: 'abc', role: 'Administrateur', email: 'abc@test.com', status: 'Active' },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const addUser = (newUser) => {
        setUsers([...users, { ...newUser, id: users.length + 1 }]);
        setShowForm(false);
    };

    const sortUsers = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortedUsers = [...users].sort((a, b) => {
            if (key === 'role') {
                const roleOrder = { 'Administrateur': 1, 'Modérateur': 2, 'Membre': 3 };
                return direction === 'ascending'
                    ? roleOrder[a.role] - roleOrder[b.role]
                    : roleOrder[b.role] - roleOrder[a.role];
            } else {
                const aValue = a[key].toString().toLowerCase();
                const bValue = b[key].toString().toLowerCase();
                if (aValue < bValue) {
                    return direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return direction === 'ascending' ? 1 : -1;
                }
                return 0;
            }
        });

        setUsers(sortedUsers);
        setSortConfig({ key, direction });
    };
    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '▴' : '▾';
        }
        return '';
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Gestion des membres</h1>

            <div className="flex justify-between items-center mb-4">
                <div></div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Ajouter
                </button>
            </div>

            {showForm && <AddUserForm onSave={addUser} onCancel={() => setShowForm(false)} />}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => sortUsers('id')}>
                                # {getSortIndicator('id')}
                            </th>
                            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => sortUsers('name')}>
                                Nom {getSortIndicator('name')}
                            </th>
                            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => sortUsers('role')}>
                                Role {getSortIndicator('role')}
                            </th>
                            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => sortUsers('email')}>
                                Email {getSortIndicator('email')}
                            </th>
                            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => sortUsers('status')}>
                                État {getSortIndicator('status')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-100">
                                <td className="px-4 py-2">{user.id}</td>
                                <td className="px-4 py-2">{user.name}</td>
                                <td className="px-4 py-2">{user.role}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td
                                    className={`px-4 py-2 font-semibold ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {user.status === 'Active' ? 'Actif' : 'Inactif'}
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
