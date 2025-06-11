import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enUS from './locales/en-US/translation.json';
import enGB from './locales/en-GB/translation.json';
import es from './locales/es/translation.json';
import esMX from './locales/es-MX/translation.json';
import esES from './locales/es-ES/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            'en-US': { translation: enUS },
            'en-GB': { translation: enGB },
            'es-MX': { translation: esMX },
            'es-ES': { translation: esES },
        },
        fallbackLng: 'en-US',
        interpolation: { escapeValue: false },
    });

export default i18n;


