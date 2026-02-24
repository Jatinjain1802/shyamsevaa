import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import hi from "../locales/hi.json";
import hn from "../locales/hn.json";

const translations = { en, hi, hn };

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
     */
    const t = (path) => {
        return path.split(".").reduce((obj, key) => obj?.[key], translationsData) || path;
    };

    const changeLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
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
