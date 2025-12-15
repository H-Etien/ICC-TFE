//Fichier pour changer de langue sur le site

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import fr from "./locales/fr.json";
import en from "./locales/en.json";

i18n.use(LanguageDetector) // Détecte la langue du navigateur
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            fr: { translation: fr },
        },
        fallbackLng: "fr", // Langue par défaut
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "navigator"], // Cherche d'abord dans le localStorage
            caches: ["localStorage"],
        },
    });

export default i18n;
