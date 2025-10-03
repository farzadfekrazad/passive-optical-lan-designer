import React, { useState, useMemo } from 'react';
import { useI18n } from '../contexts/I18nContext';
import faDefaults from '../i18n/locales/fa';

const TranslationEditor: React.FC = () => {
  const { getRawTranslations, saveCustomTranslations, t } = useI18n();
  const [translations, setTranslations] = useState(() => getRawTranslations('fa'));
  const [filter, setFilter] = useState('');

  const handleSave = () => {
    const customTranslations: Record<string, string> = {};
    for (const key in translations) {
        if (translations[key] !== faDefaults[key as keyof typeof faDefaults]) {
            customTranslations[key] = translations[key];
        }
    }
    saveCustomTranslations(customTranslations);
    alert(t('translationEditor.saveSuccess'));
    // Force a re-render in the current component with the latest from context
    setTranslations(getRawTranslations('fa'));
  };

  const handleReset = () => {
      if (window.confirm(t('translationEditor.resetConfirm'))) {
          saveCustomTranslations({});
          setTranslations(faDefaults);
      }
  };

  const handleChange = (key: string, value: string) => {
    setTranslations(prev => ({ ...prev, [key]: value }));
  };

  const filteredKeys = useMemo(() => {
    return Object.keys(translations).filter(key => 
      key.toLowerCase().includes(filter.toLowerCase()) || 
      translations[key].toLowerCase().includes(filter.toLowerCase())
    ).sort();
  }, [translations, filter]);

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
        {filteredKeys.map(key => (
          <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-gray-900/50 p-2 rounded">
            <label className="text-sm text-gray-400 font-mono break-all self-start pt-1">{key}</label>
            <textarea
              value={translations[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white resize-y"
              rows={1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranslationEditor;