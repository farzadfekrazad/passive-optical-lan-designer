import React from 'react';
import type { User } from '../types';
import { useI18n } from '../contexts/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onAdminClick: () => void;
  isAdminOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onAdminClick, isAdminOpen }) => {
  const { t } = useI18n();
  const canAccessAdmin = user.role === 'admin' || user.role === 'readonly_admin';
  
  return (
    <header className="bg-gray-800 shadow-md p-4 print-hide">
      <div className="max-w-[1920px] mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">{t('header.title')}</h1>
          <p className="text-gray-400">{t('header.subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{t('header.welcome')},</span>
            <span className="font-semibold text-cyan-300">{user.email}</span>
          </div>
          {canAccessAdmin && (
            <button
              onClick={onAdminClick}
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                isAdminOpen 
                  ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                  : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
              }`}
            >
              {isAdminOpen ? t('header.closeAdminPanel') : t('header.adminPanel')}
            </button>
          )}
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            {t('header.logout')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;