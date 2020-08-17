import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

const host = '';

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    preload: ['en'],
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: true,
      useSuspense: false,
    },
    backend: {
      loadPath: `${host}/locales/{{lng}}/{{ns}}.json`,
      crossDomain: true,
    },
  });

export default i18n;
