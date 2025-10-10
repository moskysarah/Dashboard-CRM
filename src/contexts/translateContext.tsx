import React, { createContext, useContext, useState, useEffect } from "react";
import { translateText } from "../services/translateService";

type LanguageCode = "fr" | "en";

interface TranslationContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  translate: (text: string) => Promise<string>;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>(
    (localStorage.getItem("language") as LanguageCode) || "fr"
  );

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const translate = async (text: string): Promise<string> => {
    if (language === "fr") return text;
    return await translateText(text, language);
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslationContext must be used within TranslationProvider");
  return ctx;
};
