import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

import en from '../i18n/locales/en';
import fa from '../i18n/locales/fa';

type Language = 'en' | 'fa';
type Translations = Record<string, string>;

const TRANSLATIONS_STORAGE_KEY = 'custom_fa_translations';

const translations = {
  en,
  fa,
};

// FIX: Export TranslationKeys to be used across the application for type-safe translations.
export type TranslationKeys = keyof typeof en;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys, replacements?: Record<string, string | number>) => string;
  getRawTranslations: (lang: Language) => Translations;
  saveCustomTranslations: (customTranslations: Translations) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
      const storedLang = localStorage.getItem('language');
      return (storedLang === 'en' || storedLang === 'fa') ? storedLang : 'fa';
  });
  const [customFaTranslations, setCustomFaTranslations] = useState<Translations>(() => {
      try {
          const stored = localStorage.getItem(TRANSLATIONS_STORAGE_KEY);
          return stored ? JSON.parse(stored) : {};
      } catch {
          return {};
      }
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);
  
  const getRawTranslations = (lang: Language): Translations => {
      if (lang === 'fa') {
          return { ...translations.fa, ...customFaTranslations };
      }
      return translations.en;
  };
  
  const saveCustomTranslations = (newCustomTranslations: Translations) => {
      setCustomFaTranslations(newCustomTranslations);
      localStorage.setItem(TRANSLATIONS_STORAGE_KEY, JSON.stringify(newCustomTranslations));
  };

  const t = useCallback((key: TranslationKeys, replacements?: Record<string, string | number>): string => {
    const currentTranslations = getRawTranslations(language);
    let translation = currentTranslations[key] || translations['en'][key] || key;
    
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
      });
    }
    
    return translation;
  }, [language, customFaTranslations]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, getRawTranslations, saveCustomTranslations }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
