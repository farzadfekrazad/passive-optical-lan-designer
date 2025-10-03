
import React, { useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { authService } from '../auth/authService';
import { useI18n } from '../contexts/I18nContext';

interface UserManagementProps {
    initialUsers: User[];
}

const UserManagement: React.FC<UserManagementProps> = ({ initialUsers }) => {
    const { t } = useI18n();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' as UserRole });
    const [error, setError] = useState('');

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    const fetchUsers = async () => {
        const res = await fetch('http://localhost:3001/api/users', { headers: authService.getAuthHeaders() });
        if(res.ok) {
            const data = await res.json();
            setUsers(data);
        }
    }

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const res = await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: { ...authService.getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        const data = await res.json();
        if (res.ok) {
            fetchUsers();
            setIsAdding(false);
            setNewUser({ email: '', password: '', role: 'user' });
        } else {
            setError(t(data.messageKey || 'server.error.generic'));
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if(window.confirm(t('userManagement.deleteConfirm'))) {
            const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
                method: 'DELETE',
                headers: authService.getAuthHeaders()
            });
            if (res.ok) {
                fetchUsers();
            } else {
                const data = await res.json();
                alert(t(data.messageKey || 'server.error.generic'));
            }
        }
    }

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        const res = await fetch(`http://localhost:3001/api/users/${userId}/role`, {
            method: 'PUT',
            headers: { ...authService.getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });

        if(res.ok) {
             fetchUsers();
        } else {
            const data = await res.json();
            alert(t(data.messageKey || 'server.error.generic'));
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cyan-400">{t('userManagement.title')}</h2>
                {!isAdding && <button onClick={() => setIsAdding(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                    {t('userManagement.addUser')}
                </button>}
            </div>
            {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}
            {isAdding && (
                <form onSubmit={handleAddUser} className="bg-gray-900/50 p-4 rounded-md mb-4 space-y-4">
                    <h3 className="font-semibold text-lg text-gray-300">{t('userManagement.newUserFormTitle')}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <input type="email" placeholder={t('userManagement.email')} value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                         <input type="password" placeholder={t('userManagement.password')} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                         <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
                             <option value="user">{t('userManagement.role.user')}</option>
                             <option value="admin">{t('userManagement.role.admin')}</option>
                             <option value="readonly_admin">{t('userManagement.role.readonly_admin')}</option>
                         </select>
                     </div>
                     <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold py-2 px-4 rounded-md">{t('userManagement.cancel')}</button>
                        <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md">{t('userManagement.saveUser')}</button>
                     </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-start text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('userManagement.table.email')}</th>
                            <th scope="col" className="px-6 py-3">{t('userManagement.table.role')}</th>
                            <th scope="col" className="px-6 py-3">{t('userManagement.table.status')}</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">{t('admin.table.actions')}</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                                <td className="px-6 py-4">
                                     <select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value as UserRole)} className="bg-gray-700 border-none rounded-md p-1">
                                        <option value="user">{t('userManagement.role.user')}</option>
                                        <option value="admin">{t('userManagement.role.admin')}</option>
                                        <option value="readonly_admin">{t('userManagement.role.readonly_admin')}</option>
                                     </select>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.verified ? 'bg-green-800 text-green-200' : 'bg-yellow-800 text-yellow-200'}`}>
                                        {user.verified ? t('userManagement.status.verified') : t('userManagement.status.unverified')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-end">
                                    <button onClick={() => handleDeleteUser(user.id)} disabled={user.role === 'admin'} className="font-medium text-red-500 hover:underline disabled:text-gray-500 disabled:cursor-not-allowed">{t('admin.delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
