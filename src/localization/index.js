// src/localization/index.js
import { en } from './en.js';
import { tr } from './tr.js';

const translations = { en, tr };

let currentLanguage = document.documentElement.lang || 'en';
if (!translations[currentLanguage]) {
  console.warn(`Translations for language "${currentLanguage}" not found. Falling back to "en".`);
  currentLanguage = 'en';
}

/**
 * Retrieves a translated string for the given key.
 * @param {string} key - The key of the string to translate.
 * @param {Object.<string, string>} [params] - Optional parameters to replace in the string.
 * @returns {string} The translated string or the key itself if not found.
 */
export function t(key, params = {}) {
  let text = translations[currentLanguage]?.[key] || key;
  if (params) {
    for (const paramKey in params) {
      text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), params[paramKey]);
    }
  }
  return text;
}

/**
 * Allows changing the language dynamically.
 * You might need to trigger a re-render of components using translated strings.
 * For now, a page reload after changing html lang attribute is assumed for simplicity.
 * @param {string} lang - The new language code (e.g., 'en', 'tr').
 */
export function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    console.log(`Language changed to: ${lang}`);
  } else {
    console.warn(`Attempted to set unsupported language: ${lang}`);
  }
}