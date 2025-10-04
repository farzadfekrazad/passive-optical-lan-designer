

import React, { useState, useMemo, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import faDefaults from '../i18n/locales/fa';
import enTranslations from '../i18n/locales/en';
import { authService } from '../auth/authService';

const TranslationEditor: React.FC = () => {
  const { t, saveCustomTranslations, getRawTranslations } = useI18n();
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchTranslations = async () => {
    setIsLoading(true);
    const res = await fetch('/api/settings/translations/fa', {
        headers: authService.getAuthHeaders(),
    });
    if (res.ok) {
        const customTranslations = await res.json();
        // Update context first
        saveCustomTranslations(customTranslations);
        // Then update local state for editing
        setTranslations({ ...faDefaults, ...customTranslations });
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchTranslations();
  }, []);


  const handleSave = async () => {
    const res = await fetch('/api/settings/translations/fa', {
        method: 'POST',
        headers: { ...authService.getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(translations),
    });
    if (res.ok) {
        const custom = await res.json();
        saveCustomTranslations(custom);
        setTranslations({ ...faDefaults, ...custom });
        alert(t('translationEditor.saveSuccess'));
    }
  };

  const handleReset = async () => {
      if (window.confirm(t('translationEditor.resetConfirm'))) {
          const res = await fetch('/api/settings/translations/fa', {
            method: 'DELETE',
            headers: authService.getAuthHeaders(),
          });
          if (res.ok) {
            saveCustomTranslations({});
            setTranslations(faDefaults);
          }
      }
  };

  const handleChange = (key: string, value: string) => {
    setTranslations(prev => ({ ...prev, [key]: value }));
  };

  const filteredKeys = useMemo(() => {
    const enKeys = enTranslations as Record<string, string>;
    const searchFilter = filter.toLowerCase();
    
    return Object.keys(translations).filter(key => 
      key.toLowerCase().includes(searchFilter) || 
      (translations[key] && translations[key].toLowerCase().includes(searchFilter)) ||
      (enKeys[key] && enKeys[key].toLowerCase().includes(searchFilter))
    ).sort();
  }, [translations, filter]);
  
  if (isLoading) {
      return <div>{t('app.loading')}</div>
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-cyan-400 mb-2">{t('translationEditor.title')}</h2>
      <p className="text-sm text-gray-400 mb-4">{t('translationEditor.description')}</p>
      
      <div className="flex gap-4 mb-4">
        <input 
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder={t('translationEditor.filterPlaceholder')}
            className="flex-grow bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
        />
        <button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md">
            {t('translationEditor.save')}
        </button>
        <button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md">
            {t('translationEditor.reset')}
        </button>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto p-1">
        {/* Headers */}
        <div className="grid grid-cols-12 gap-4 items-center bg-gray-900 p-2 rounded-md sticky top-0 z-10">
            <h3 className="col-span-3 text-sm font-bold text-gray-300 uppercase">{t('translationEditor.keyHeader')}</h3>
            <h3 className="col-span-4 text-sm font-bold text-gray-300 uppercase">{t('translationEditor.englishHeader')}</h3>
            <h3 className="col-span-5 text-sm font-bold text-gray-300 uppercase">{t('translationEditor.persianHeader')}</h3>
        </div>

        {filteredKeys.map(key => (
          <div key={key} className="grid grid-cols-12 gap-4 items-start bg-gray-900/50 p-2 rounded">
            <label className="col-span-3 text-sm text-gray-400 font-mono break-all self-start pt-1">{key}</label>
            <p className="col-span-4 text-sm text-gray-300 bg-gray-700/50 p-2 rounded-md min-h-[38px]">
                {enTranslations[key as keyof typeof enTranslations]}
            </p>
            <textarea
              value={translations[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="col-span-5 w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white resize-y"
              rows={1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranslationEditor;
