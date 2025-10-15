import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { translateText } from '../services/translateService';
import { TRANSLATE_CACHE } from './translateConstants';
import { TranslateContext, type TranslateContextType } from './translateContext.ts';

interface TranslateProviderProps {
  children: ReactNode;
}

export const TranslateProvider: React.FC<TranslateProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    // Load language from localStorage or default to 'fr'
    return localStorage.getItem('app-language') || 'fr';
  });

  const translate = useCallback(async (text: string): Promise<string> => {
    if (language === 'fr') {
      return text; // No translation needed for French
    }

    const cacheKey = `${text}-${language}`;
    if (TRANSLATE_CACHE.has(cacheKey)) {
      return TRANSLATE_CACHE.get(cacheKey)!;
    }

    try {
      const translatedText = await translateText(text, language);
      TRANSLATE_CACHE.set(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Fallback to original text
    }
  }, [language]);

  const handleSetLanguage = useCallback((lang: string) => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  }, []);

  const value: TranslateContextType = {
    language,
    setLanguage: handleSetLanguage,
    translate,
  };

  return (
    <TranslateContext.Provider value={value}>
      {children}
    </TranslateContext.Provider>
  );
};
