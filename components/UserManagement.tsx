import React, { useState } from 'react';
import type { User, UserRole } from '../types';
import { authService } from '../auth/authService';
import { useI18n } from '../contexts/I18nContext';

interface UserManagementProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers }) => {
    const { t } = useI18n();
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' as UserRole });

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const result = authService.addUser(newUser.email, newUser.password, newUser.role);
        if (result.success) {
            setUsers(authService.getAllUsers());
            setIsAdding(false);
            setNewUser({ email: '', password: '', role: 'user' });
        } else {
            alert(t(result.messageKey));
        }
    };

    const handleDeleteUser = (userId: string) => {
        if(window.confirm(t('userManagement.deleteConfirm'))) {
            const result = authService.deleteUser(userId);
            if (result.success) {
                setUsers(authService.getAllUsers());
            } else {
                alert(t(result.messageKey));
            }
        }
    }

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            const result = authService.updateUser({...user, role: newRole});
            if(result.success) {
                 setUsers(authService.getAllUsers());
            } else {
                alert(t(result.messageKey));
            }
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
                                    <button onClick={() => handleDeleteUser(user.id)} className="font-medium text-red-500 hover:underline">{t('admin.delete')}</button>
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