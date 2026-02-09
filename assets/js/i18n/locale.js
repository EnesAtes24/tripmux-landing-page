/**
 * Tripmux locale/preference module.
 *
 * Manages language + currency selection with localStorage persistence.
 *
 * Currency modes:
 *   AUTO   — resolved from backend /api/meta/client-context on every load
 *   MANUAL — user explicitly picked a currency; persisted and never auto-changed
 */

import { API_BASE } from "../config/env.js";
import { translations } from "./translations.js";

// ——— Storage keys ———
const LANG_KEY = "tripmux_lang";
const CURRENCY_KEY = "tripmux.currency";
const CURRENCY_AUTO_RESOLVED_KEY = "tripmux.currency.autoResolved";

// ——— Supported values ———
const SUPPORTED_LANGS = ["en", "tr"];
const SUPPORTED_CURRENCIES = ["TRY", "EUR", "USD"];

// ——— Module state ———
let currentLang = "en";
let selectedCurrency = "AUTO"; // "AUTO" | "TRY" | "EUR" | "USD" — single source of truth
let effectiveCurrency = "EUR"; // Resolved currency for API calls
let initialized = false;

// ——— Change listeners ———
const listeners = [];

export function onLocaleChange(fn) {
    listeners.push(fn);
}

function notifyListeners() {
    for (const fn of listeners) {
        try { fn({ lang: currentLang, selectedCurrency, effectiveCurrency }); }
        catch (e) { console.error("Locale listener error:", e); }
    }
}

// ——— Getters ———
export function getLang() { return currentLang; }

/**
 * Get the selected currency preference ("AUTO" | "TRY" | "EUR" | "USD").
 */
export function getSelectedCurrency() { return selectedCurrency; }

/**
 * Get the effective currency for API calls (always "TRY" | "EUR" | "USD", never "AUTO").
 * This is the resolved currency that should be sent to the backend.
 */
export function getEffectiveCurrency() { return effectiveCurrency; }

/**
 * @deprecated Use getEffectiveCurrency() instead.
 * Kept for backward compatibility.
 */
export function getCurrency() { return effectiveCurrency; }

/**
 * Get a translation string for the current language.
 */
export function t(key) {
    const dict = translations[currentLang] || translations.en;
    return dict[key] ?? translations.en[key] ?? key;
}

// ——— Setters ———

export function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    notifyListeners();
}

/**
 * Set currency preference.
 *
 * @param {string} currency  "AUTO" | "TRY" | "EUR" | "USD"
 */
export async function setCurrency(currency) {
    if (currency !== "AUTO" && !SUPPORTED_CURRENCIES.includes(currency)) {
        console.warn(`Invalid currency: ${currency}`);
        return;
    }

    selectedCurrency = currency;
    localStorage.setItem(CURRENCY_KEY, currency);

    // Resolve effective currency
    if (currency === "AUTO") {
        const resolved = await fetchSuggestedCurrency();
        effectiveCurrency = resolved;
        localStorage.setItem(CURRENCY_AUTO_RESOLVED_KEY, resolved);
    } else {
        effectiveCurrency = currency;
        localStorage.removeItem(CURRENCY_AUTO_RESOLVED_KEY);
    }

    notifyListeners();
}

// ——— Initialization ———

/**
 * Initialize locale preferences.
 *
 * Language priority:
 *   1) localStorage
 *   2) navigator.language
 *
 * Currency priority:
 *   1) localStorage tripmux.currency (if present)
 *   2) Default to "AUTO"
 */
export async function initLocale() {
    if (initialized) return;
    initialized = true;

    // --- Language ---
    const storedLang = localStorage.getItem(LANG_KEY);
    if (storedLang && SUPPORTED_LANGS.includes(storedLang)) {
        currentLang = storedLang;
    } else {
        const browserLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
        currentLang = browserLang.startsWith("tr") ? "tr" : "en";
    }

    // --- Currency: single source of truth ---
    const storedCurrency = localStorage.getItem(CURRENCY_KEY);
    if (storedCurrency && (storedCurrency === "AUTO" || SUPPORTED_CURRENCIES.includes(storedCurrency))) {
        selectedCurrency = storedCurrency;
    } else {
        selectedCurrency = "AUTO";
        localStorage.setItem(CURRENCY_KEY, "AUTO");
    }

    // Resolve effective currency
    if (selectedCurrency === "AUTO") {
        // Try to use cached auto-resolved value first
        const cached = localStorage.getItem(CURRENCY_AUTO_RESOLVED_KEY);
        if (cached && SUPPORTED_CURRENCIES.includes(cached)) {
            effectiveCurrency = cached;
        } else {
            effectiveCurrency = await fetchSuggestedCurrency();
            localStorage.setItem(CURRENCY_AUTO_RESOLVED_KEY, effectiveCurrency);
        }
    } else {
        effectiveCurrency = selectedCurrency;
    }

    document.documentElement.lang = currentLang;
    notifyListeners();
}

// ——— Backend fetch ———

async function fetchSuggestedCurrency() {
    try {
        const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
        const url = `${base}/meta/client-context`;
        const res = await fetch(url, { credentials: "omit" });
        if (!res.ok) return "EUR";
        const data = await res.json();
        const suggested = data.suggestedCurrency;
        if (SUPPORTED_CURRENCIES.includes(suggested)) return suggested;
        return "EUR";
    } catch (e) {
        console.warn("Could not fetch client context, defaulting to EUR:", e.message);
        return "EUR";
    }
}
