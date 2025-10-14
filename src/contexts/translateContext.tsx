import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { translateText } from '../services/translateService';

interface TranslateContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
  cache: Map<string, string>;
}

const TranslateContext = createContext<TranslateContextType | undefined>(undefined);

export const useTranslate = () => {
  const context = useContext(TranslateContext);
  if (!context) {
    throw new Error('useTranslate must be used within a TranslateProvider');
  }
  return context;
};

interface TranslateProviderProps {
  children: ReactNode;
}

export const TranslateProvider: React.FC<TranslateProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    // Load language from localStorage or default to 'fr'
    return localStorage.getItem('app-language') || 'fr';
  });
  const [cache] = useState<Map<string, string>>(new Map());

  const translate = useCallback(async (text: string): Promise<string> => {
    if (language === 'fr') {
      return text; // No translation needed for French
    }

    const cacheKey = `${text}-${language}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    try {
      const translatedText = await translateText(text, language);
      cache.set(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Fallback to original text
    }
  }, [language, cache]);

  const handleSetLanguage = useCallback((lang: string) => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  }, []);

  const value: TranslateContextType = {
    language,
    setLanguage: handleSetLanguage,
    translate,
    cache,
  };

  return (
    <TranslateContext.Provider value={value}>
      {children}
    </TranslateContext.Provider>
  );
};
