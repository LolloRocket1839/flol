import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en.json';
import itTranslation from './locales/it.json';

// Configure i18next
i18n
  .use(LanguageDetector) // Detects the browser language
  .use(initReactI18next) // Passes i18n to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      it: {
        translation: itTranslation
      }
    },
    fallbackLng: 'it', // Default Italian as fallback
    supportedLngs: ['en', 'it'], // List of supported languages
    
    // Options for language detection
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    
    // Default language namespace
    defaultNS: 'translation',
  });

export default i18n; 