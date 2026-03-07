import React from "react";
import { useLanguage } from "../context/LanguageContext";

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage();

    return (
        <div className="flex gap-2 p-4">
            <button
                onClick={() => changeLanguage("en")}
                className={`px-3 py-1 rounded ${language === "en" ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
            >
                English
            </button>
            <button
                onClick={() => changeLanguage("hi")}
                className={`px-3 py-1 rounded ${language === "hi" ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
            >
                हिन्दी (Hindi)
            </button>

        </div>
    );
};

export default LanguageSwitcher;
