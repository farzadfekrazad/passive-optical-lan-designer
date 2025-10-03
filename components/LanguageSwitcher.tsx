import React from 'react';
import { useI18n } from '../contexts/I18nContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex rounded-md bg-gray-700 p-1 text-sm">
        <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-md transition-colors ${language === 'en' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
        >
            English
        </button>
        <button
            onClick={() => setLanguage('fa')}
            className={`px-3 py-1 rounded-md transition-colors ${language === 'fa' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
        >
            فارسی
        </button>
    </div>
  );
};

export default LanguageSwitcher;
