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
const LANG_OVERRIDE_KEY = "tmx_lang_override"; // User manual selection
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
    // Set override when user manually selects language
    localStorage.setItem(LANG_OVERRIDE_KEY, lang);
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

// ——— Location-based language detection ———

/**
 * Detect language based on location (Turkey => TR, else EN).
 * Uses heuristics: timezone, navigator.language.
 * 
 * TODO: Enhance with API country detection if available.
 * The /meta/client-context endpoint may provide country info.
 * Example integration:
 *   const context = await fetchClientContext();
 *   if (context?.country === "TR") return "tr";
 */
function getAutoLanguage() {
    // Method 1: Check timezone (most reliable for Turkey)
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone === "Europe/Istanbul") {
            return "tr";
        }
    } catch (e) {
        // Fallback if timezone detection fails
    }
    
    // Method 2: Check navigator.language
    const browserLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    if (browserLang.startsWith("tr")) {
        return "tr";
    }
    
    // Default: English
    return "en";
}

// ——— Initialization ———

/**
 * Initialize locale preferences.
 *
 * Language priority:
 *   1) URL param ?lang=tr or ?lang=en (immediate, sets override)
 *   2) localStorage tmx_lang_override (user manual selection)
 *   3) getAutoLanguage() (location-based: Turkey => TR, else EN)
 *
 * Currency priority:
 *   1) localStorage tripmux.currency (if present)
 *   2) Default to "AUTO"
 */
export async function initLocale() {
    if (initialized) return;
    initialized = true;

    // --- Language ---
    // Check URL param first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("lang");
    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) {
        currentLang = urlLang;
        localStorage.setItem(LANG_OVERRIDE_KEY, urlLang);
    } else {
        // Check localStorage override (user manual selection)
        const overrideLang = localStorage.getItem(LANG_OVERRIDE_KEY);
        if (overrideLang && SUPPORTED_LANGS.includes(overrideLang)) {
            currentLang = overrideLang;
        } else {
            // Use location-based auto-detection
            currentLang = getAutoLanguage();
            // Do NOT persist auto-detection to override (only persist when user manually selects)
        }
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
        // Always fetch fresh on page load (don't use cache)
        effectiveCurrency = await fetchSuggestedCurrency();
        localStorage.setItem(CURRENCY_AUTO_RESOLVED_KEY, effectiveCurrency);
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
