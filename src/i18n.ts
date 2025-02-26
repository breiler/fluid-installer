import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import englishTranslations from "./assets/locales/en/translations.json";
import swedishTranslations from "./assets/locales/sv/translations.json";
import dutchTranslations from "./assets/locales/nl/translations.json";

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: false,
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        }
    });

i18n.addResourceBundle("en", "translation", englishTranslations);
i18n.addResourceBundle("sv", "translation", swedishTranslations);
i18n.addResourceBundle("nl", "translation", dutchTranslations);

export const Language = {
    en: "English",
    sv: "Svenska",
    nl: "Nederlands"
};

export default i18n;
