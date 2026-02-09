import { initLocale, onLocaleChange, getLang, getSelectedCurrency, getEffectiveCurrency, setLang, setCurrency, t } from "./i18n/locale.js";
import { bindEvents, searchFlights } from "./ui/events.js";
import { getResultsEl } from "./ui/dom.js";

// ——— Currency symbol map for trigger label ———
const CUR_SYMBOLS = { TRY: "₺", EUR: "€", USD: "$" };

// ——— Initialize locale, then bind events ———
initLocale().then(() => {
    applyI18n();
    syncLocaleSelectors();
    bindEvents();
});

// ——— Locale change listener ———
onLocaleChange(({ selectedCurrency: newCurrency, effectiveCurrency: newEffective }) => {
    applyI18n();
    syncLocaleSelectors();
    
    // If currency changed and we have results, refresh the search
    const resultsEl = getResultsEl();
    if (resultsEl && resultsEl.innerHTML && resultsEl.innerHTML.trim() && !resultsEl.innerHTML.includes("noResults")) {
        // Only refresh if there are actual results displayed
        // Small delay to ensure currency is fully resolved
        setTimeout(() => {
            searchFlights();
        }, 100);
    }
});

// ——— Apply data-i18n translations to the DOM ———
function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const val = t(key);
        if (typeof val === "string") el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        const val = t(key);
        if (typeof val === "string") el.placeholder = val;
    });
}

// ——— Sync all locale selectors with current state ———
function syncLocaleSelectors() {
    const lang = getLang();
    const selected = getSelectedCurrency();
    const effective = getEffectiveCurrency();

    // Language segmented toggle
    document.querySelectorAll("#langToggle .locale-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    // Currency trigger label
    const curLabel = document.getElementById("curLabel");
    if (curLabel) {
        if (selected === "AUTO") {
            const sym = CUR_SYMBOLS[effective] || "";
            curLabel.textContent = `🌍 Auto (${sym} ${effective})`;
        } else {
            const sym = CUR_SYMBOLS[selected] || "";
            curLabel.textContent = `${sym} ${selected}`;
        }
    }

    // Currency panel: mark selected option
    const activeValue = selected;
    document.querySelectorAll("#curPanel .cur-option").forEach((opt) => {
        const isSelected = opt.dataset.value === activeValue;
        opt.classList.toggle("selected", isSelected);
        opt.setAttribute("aria-selected", isSelected);
    });

    // Update Auto option text dynamically
    const autoOpt = document.querySelector('#curPanel .cur-option[data-value="AUTO"] .cur-option__text');
    if (autoOpt) {
        const sym = CUR_SYMBOLS[effective] || "";
        autoOpt.textContent = selected === "AUTO" ? `Auto (${sym} ${effective})` : "Auto";
    }
}

// ═══════════════════════════════════════════
//  LANGUAGE TOGGLE
// ═══════════════════════════════════════════
document.querySelectorAll("#langToggle .locale-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const lang = btn.dataset.lang;
        if (lang) setLang(lang);
    });
});

// ═══════════════════════════════════════════
//  CURRENCY CUSTOM DROPDOWN
// ═══════════════════════════════════════════
const curTrigger = document.getElementById("curTrigger");
const curPanel = document.getElementById("curPanel");

function openCurrencyPanel() {
    if (!curPanel || !curTrigger) return;
    curPanel.hidden = false;
    curTrigger.setAttribute("aria-expanded", "true");
}

function closeCurrencyPanel() {
    if (!curPanel || !curTrigger) return;
    curPanel.hidden = true;
    curTrigger.setAttribute("aria-expanded", "false");
}

function toggleCurrencyPanel() {
    if (curPanel && !curPanel.hidden) {
        closeCurrencyPanel();
    } else {
        openCurrencyPanel();
    }
}

// Toggle on trigger click
if (curTrigger) {
    curTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleCurrencyPanel();
    });
}

// Option clicks
document.querySelectorAll("#curPanel .cur-option").forEach((opt) => {
    opt.addEventListener("click", async () => {
        const value = opt.dataset.value;
        if (value) {
            await setCurrency(value); // setCurrency is now async
        }
        closeCurrencyPanel();
    });
});

// Close on outside click
document.addEventListener("click", (e) => {
    if (curPanel && !curPanel.hidden) {
        const dropdown = document.getElementById("curDropdown");
        if (dropdown && !dropdown.contains(e.target)) {
            closeCurrencyPanel();
        }
    }
});

// Close on Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && curPanel && !curPanel.hidden) {
        closeCurrencyPanel();
        curTrigger?.focus();
    }
});

// ═══════════════════════════════════════════
//  NAVBAR HAMBURGER MENU
// ═══════════════════════════════════════════
const burger = document.querySelector('.tmx-burger');
const mobileMenu = document.querySelector('.tmx-mobile-menu');
const mobileLinks = document.querySelectorAll('.tmx-mobile-link, .tmx-mobile-cta');

if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
        const isExpanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.hidden = isExpanded;
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.setAttribute('aria-expanded', 'false');
            mobileMenu.hidden = true;
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
            burger.setAttribute('aria-expanded', 'false');
            mobileMenu.hidden = true;
        }
    });
}
