import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import englishTranslations from "./assets/locales/en/translations.json";
import swedishTranslations from "./assets/locales/sv-SE/translations.json";
import dutchTranslations from "./assets/locales/nl-NL/translations.json";
import brazilianTranslations from "./assets/locales/pt-BR/translations.json";
import portugueseTranslations from "./assets/locales/pt-PT/translations.json";
import germanTranslations from "./assets/locales/de-DE/translations.json";
import frenchTranslations from "./assets/locales/fr-FR/translations.json";
import russianTranslations from "./assets/locales/ru-RU/translations.json";

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

i18n.addResourceBundle("de", "translation", germanTranslations);
i18n.addResourceBundle("en", "translation", englishTranslations);
i18n.addResourceBundle("fr", "translation", frenchTranslations);
i18n.addResourceBundle("nl", "translation", dutchTranslations);
i18n.addResourceBundle("pt-BR", "translation", brazilianTranslations);
i18n.addResourceBundle("pt-PT", "translation", portugueseTranslations);
i18n.addResourceBundle("ru", "translation", russianTranslations);
i18n.addResourceBundle("sv", "translation", swedishTranslations);

export const Language = {
    en: "English",
    nl: "Nederlands",
    "pt-BR": "Português",
    "pt-PT": "Português",
    sv: "Svenska",
    de: "Deutsch",
    fr: "Français",
    ru: "Русский"
};

export default i18n;
