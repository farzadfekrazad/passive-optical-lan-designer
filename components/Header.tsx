
import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onAdminClick: () => void;
  isAdminOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onAdminClick, isAdminOpen }) => {
  const canAccessAdmin = user.role === 'admin' || user.role === 'readonly_admin';
  
  return (
    <header className="bg-gray-800 shadow-md p-4 print-hide">
      <div className="max-w-[1920px] mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">Passive Optical LAN (POL) Designer</h1>
          <p className="text-gray-400">Visualize and configure your end-to-end POL network architecture.</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">Welcome, <span className="font-semibold text-cyan-300">{user.email}</span></span>
          {canAccessAdmin && (
            <button
              onClick={onAdminClick}
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                isAdminOpen 
                  ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                  : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
              }`}
            >
              {isAdminOpen ? 'Close Admin' : 'Admin Panel'}
            </button>
          )}
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
