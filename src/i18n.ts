import frTranslation from "./locales/fr/translation.json";
import enTranslation from "./locales/en/translation.json";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: frTranslation },
      en: { translation: enTranslation },
    },
    lng: "fr", // la langue par défaut
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
