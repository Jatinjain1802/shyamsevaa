import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROK_API_KEY,
});

/**
 * Translates English text to Hindi using Groq (Llama 3 70b)
 * @param {string} text - The text to translate
 * @returns {Promise<string>} - The translated Hindi text
 */
export const translateToHindi = async (text) => {
    if (!text || typeof text !== "string") return "";

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional translator. Translate the following English text to Hindi. Respond ONLY with the translated text, no explanations, no quotes.",
                },
                {
                    role: "user",
                    content: text,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
        });

        return completion.choices[0]?.message?.content?.trim() || "";
    } catch (error) {
        console.error("Translation error:", error);
        // Fallback to original text if translation fails
        return text;
    }
};

/**
 * Translates multiple fields of an object from English to Hindi
 * @param {Object} obj - Object containing fields to translate
 * @param {Array<string>} [fields] - Optional list of keys to translate. If not provided, translates all keys in obj.
 * @returns {Promise<Object>} - New object with translated fields (suffixed with _hi)
 */
export const translateObject = async (obj, fields) => {
    if (!obj) return {};
    
    const translations = {};
    // If fields are not provided, translate all keys in the object
    const keysToTranslate = fields || Object.keys(obj);
    
    for (const field of keysToTranslate) {
        if (obj[field]) {
            translations[`${field}_hi`] = await translateToHindi(obj[field]);
        } else {
            translations[`${field}_hi`] = "";
        }
    }
    
    return translations;
};
