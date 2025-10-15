import React from 'react';

interface TranslateContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
}

export const TranslateContext = React.createContext<TranslateContextType | undefined>(undefined);

export const useTranslate = () => {
  const context = React.useContext(TranslateContext);
  if (!context) {
    throw new Error('useTranslate must be used within a TranslateProvider');
  }
  return context;
};

export type { TranslateContextType };
