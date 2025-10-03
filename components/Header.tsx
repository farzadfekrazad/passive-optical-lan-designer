
import React from 'react';

interface HeaderProps {
  onAdminClick: () => void;
  isAdminOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, isAdminOpen }) => {
  return (
    <header className="bg-gray-800 shadow-md p-4">
      <div className="max-w-[1920px] mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">Passive Optical LAN (POL) Designer</h1>
          <p className="text-gray-400">Visualize and configure your end-to-end POL network architecture.</p>
        </div>
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
      </div>
    </header>
  );
};

export default Header;
