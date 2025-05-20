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
import spanishTranslations from "./assets/locales/es-ES/translations.json";
import ukrainianTranslation from "./assets/locales/uk-UA/translations.json";
import italianTranslation from "./assets/locales/it-IT/translations.json";
import polishTranslation from "./assets/locales/pl-PL/translations.json";
import turkishTranslations from "./assets/locales/tr-TR/translations.json";

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

// This orders the language bar
i18n.addResourceBundle("de", "translation", germanTranslations);
i18n.addResourceBundle("en", "translation", englishTranslations);
i18n.addResourceBundle("es", "translation", spanishTranslations);
i18n.addResourceBundle("fr", "translation", frenchTranslations);
i18n.addResourceBundle("it", "translation", italianTranslation);
i18n.addResourceBundle("nl", "translation", dutchTranslations);
i18n.addResourceBundle("pl", "translation", polishTranslation);
i18n.addResourceBundle("pt-BR", "translation", brazilianTranslations);
i18n.addResourceBundle("pt-PT", "translation", portugueseTranslations);
i18n.addResourceBundle("ru", "translation", russianTranslations);
i18n.addResourceBundle("tr", "translation", turkishTranslations);
i18n.addResourceBundle("sv", "translation", swedishTranslations);
i18n.addResourceBundle("uk", "translation", ukrainianTranslation);

export const Language = {
    en: "English",
    es: "Español",
    nl: "Nederlands",
    pl: "Polski",
    "pt-BR": "Português",
    "pt-PT": "Português",
    sv: "Svenska",
    de: "Deutsch",
    it: "Italiano",
    fr: "Français",
    ru: "Русский",
    tr: "Türkçe",
    uk: "Yкраїнська"
};

export default i18n;
