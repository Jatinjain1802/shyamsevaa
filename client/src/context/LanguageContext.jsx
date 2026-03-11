import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import hi from "../locales/hi.json";
import i18n from "../i18n";



const translations = { en, hi };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Get language from localStorage or default to 'en'
    const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");
    const [translationsData, setTranslationsData] = useState(translations[language]);

    useEffect(() => {
        setTranslationsData(translations[language]);
        localStorage.setItem("lang", language);
    }, [language]);

    /**
     * Translate function
     * @param {string} path - string path (e.g., 'nav.home')
     * @param {object} params - object containing variables for interpolation (e.g., { count: 5 })
     */
    const t = (path, params = {}) => {
        let text = path.split(".").reduce((obj, key) => obj?.[key], translationsData) || path;

        // Handle interpolation for placeholders like {{var}}
        if (typeof text === 'string' && params) {
            Object.entries(params).forEach(([key, value]) => {
                text = text.replace(new RegExp(`{{${key}}}`, 'g'), value);
            });
        }

        return text;
    };

    const changeLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
            i18n.changeLanguage(lang);
        }
    };


    return (
        <LanguageContext.Provider value={{ language, t, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
