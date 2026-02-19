import { t, getEffectiveCurrency, getLang } from "../i18n/locale.js";
import { AFFILIATES } from "../config/affiliates.js";

export function getResultsEl() {
    return document.getElementById("results");
}

export function getSearchButton() {
    return document.getElementById("searchBtn");
}

export function getDepartureInput() {
    return document.getElementById("departureAt");
}

export function getOriginInput() {
    return document.getElementById("origin");
}

export function getDestinationInput() {
    return document.getElementById("destination");
}

export function getPassengersInput() {
    return document.getElementById("passengers");
}

/**
 * Read and sanitize the passengers value from the input.
 * Returns an integer between 1 and 9.
 */
export function getPassengersValue() {
    const input = getPassengersInput();
    if (!input) return 1;
    const val = parseInt(input.value, 10);
    if (isNaN(val) || val < 1) return 1;
    if (val > 9) return 9;
    return val;
}

/**
 * Clamp the passengers input to valid range (called on blur/change).
 */
export function clampPassengersInput() {
    const input = getPassengersInput();
    if (!input) return;
    const val = parseInt(input.value, 10);
    if (isNaN(val) || val < 1) {
        input.value = "1";
    } else if (val > 9) {
        input.value = "9";
    } else {
        input.value = String(val);
    }
}

export function setHint(text) {
    document.getElementById("hint").textContent = text || "";
}

export function updateGhostPlaceholder() {
    const wrap = document.getElementById("dateWrap");
    const input = getDepartureInput();
    const isEmpty = !input.value || String(input.value).trim() === "";
    wrap.classList.toggle("is-empty", isEmpty);
}

/**
 * Format money using Intl.NumberFormat with proper locale and currency.
 */
function formatMoney(amount, currency) {
    const lang = getLang();
    const locale = lang === "tr" ? "tr-TR" : "en-US";
    
    try {
        const formatter = new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        return formatter.format(amount);
    } catch (e) {
        // Fallback if currency is invalid
        console.warn(`Invalid currency for formatting: ${currency}`, e);
        const symbols = { EUR: "€", TRY: "₺", USD: "$" };
        const sym = symbols[currency] || currency + " ";
        return `${sym}${Number(amount).toLocaleString(locale)}`;
    }
}

/**
 * Format price with currency symbol (backward compatibility wrapper).
 */
function formatPrice(price, currency) {
    return formatMoney(price, currency);
}

/**
 * Format duration minutes into "Xh Ym".
 */
function formatDuration(mins) {
    if (!mins || mins <= 0) return "—";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

/**
 * Get stops label from transfer count.
 */
function stopsLabel(transfers) {
    if (transfers === 0 || transfers == null) {
        return `<span class="fc-stops fc-stops--direct">${t("direct")}</span>`;
    }
    const word = transfers === 1 ? t("stop") : t("stops");
    return `<span class="fc-stops">${transfers} ${word}</span>`;
}

/**
 * Render a single flight card — 3-zone horizontal layout.
 */
function renderFlightCard(flight, yearMode, monthKeyFromFlight, index, requestedCurrency) {
    // Use response currency if available, otherwise fall back to requested
    const responseCurrency = (flight.currency || "").toUpperCase();
    const displayCurrency = (responseCurrency && ["TRY", "EUR", "USD"].includes(responseCurrency))
        ? responseCurrency
        : (requestedCurrency || getEffectiveCurrency() || "EUR");
    
    const bestClass = index === 0 ? " fc--best" : "";
    const monthTag = yearMode ? `<span class="fc-month">${monthKeyFromFlight(flight)}</span>` : "";

    return `
        <div class="flight-card${bestClass}">
            <div class="fc-body">
                <div class="fc-left">
                    <div class="fc-route">${flight.from} <span class="fc-arrow">→</span> ${flight.to}</div>
                    <div class="fc-airline">${flight.airlineName} <span class="fc-code">${flight.airlineCode}</span></div>
                    <div class="fc-datetime">${flight.date || "—"} ${flight.departTime ? "· " + flight.departTime : ""} ${monthTag}</div>
                </div>
                <div class="fc-right">
                    <div class="fc-badge-wrapper">${index === 0 ? `<span class="fc-badge">${t("bestPrice")}</span>` : ""}</div>
                    <div class="fc-duration">${formatDuration(flight.durationMinutes)}</div>
                    ${stopsLabel(flight.transfers)}
                    <div class="fc-price">${formatPrice(flight.price, displayCurrency)}</div>
                    <a href="${flight.aviasalesUrl}" target="_blank" rel="noopener noreferrer" class="fc-cta">
                        ${t("openPartner")}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 3h7v7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 14L21 3" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </a>
                </div>
            </div>
            <div class="fc-disclaimer">${t("partnerNote")}</div>
        </div>
    `;
}

/**
 * Safe affiliate click tracking: if gtag exists, send event; otherwise no-op.
 */
function trackAffiliateClick(partnerId) {
    try {
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "affiliate_click", { partner: partnerId });
        }
    } catch (_) {
        // no-op
    }
}

/**
 * Render the "More options" affiliate section below the results list.
 * Only shown after search (when this is called from renderFlights).
 * Reuses or replaces existing section to avoid duplication.
 */
export function renderAffiliateSection(containerEl, _context) {
    if (!containerEl) return;
    const resultsEl = getResultsEl();
    const parent = resultsEl ? resultsEl.parentElement : containerEl;
    if (!parent || !resultsEl) return;

    let section = parent.querySelector(".affiliate-section");
    if (section) section.remove();

    section = document.createElement("section");
    section.className = "affiliate-section";
    section.setAttribute("aria-label", t("affiliateSectionTitle"));

    const title = document.createElement("h3");
    title.className = "affiliate-section__title";
    title.textContent = t("affiliateSectionTitle");
    section.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.className = "affiliate-section__subtitle";
    subtitle.textContent = t("affiliateSectionSubtitle");
    section.appendChild(subtitle);

    const grid = document.createElement("div");
    grid.className = "affiliate-grid";

    for (const partner of AFFILIATES) {
        const card = document.createElement("div");
        card.className = "affiliate-card";

        const top = document.createElement("div");
        top.className = "affiliate-card__top";
        top.innerHTML = `<span class="affiliate-card__icon" aria-hidden="true">${escapeHtml(partner.icon)}</span><span class="affiliate-card__title">${escapeHtml(t(partner.titleKey) || partner.name)}</span>`;
        card.appendChild(top);

        const desc = document.createElement("p");
        desc.className = "affiliate-card__desc";
        desc.textContent = t(partner.descriptionKey) || "";
        card.appendChild(desc);

        const cta = document.createElement("a");
        cta.href = partner.url;
        cta.target = "_blank";
        cta.rel = "nofollow sponsored noopener noreferrer";
        cta.className = "affiliate-card__cta";
        cta.textContent = t("affiliateCta");
        cta.addEventListener("click", () => trackAffiliateClick(partner.id));
        card.appendChild(cta);

        grid.appendChild(card);
    }
    section.appendChild(grid);

    const disclosure = document.createElement("p");
    disclosure.className = "affiliate-disclosure";
    disclosure.textContent = t("affiliateDisclosureShort");
    section.appendChild(disclosure);

    parent.insertBefore(section, resultsEl.nextSibling);
}

export function renderFlights(container, flights, yearMode, monthKeyFromFlight, passengers) {
    container.className = 'results-list';
    container.innerHTML = "";

    if (!flights || flights.length === 0) {
        container.innerHTML = t("noResults");
        renderAffiliateSection(container.parentElement, {});
        return;
    }

    const pax = (flights[0] && flights[0].passengers > 0)
        ? flights[0].passengers
        : (passengers || 1);

    // Check for currency mismatch
    const requestedCurrency = getEffectiveCurrency();
    let currencyWarning = "";
    let hasMismatch = false;

    if (flights.length > 0) {
        const firstFlight = flights[0];
        const responseCurrency = (firstFlight.currency || "").toUpperCase();
        
        if (responseCurrency && responseCurrency !== requestedCurrency && ["TRY", "EUR", "USD"].includes(responseCurrency)) {
            hasMismatch = true;
            const currencyNames = { EUR: "EUR", TRY: "TRY", USD: "USD" };
            const responseName = currencyNames[responseCurrency] || responseCurrency;
            const warningText = (t("currencyMismatchWarning") || "Prices returned in {currency} (provider limitation).").replace("{currency}", responseName);
            currencyWarning = `<div class="currency-warning" style="background: #fff3cd; color: #856404; padding: 8px 12px; border-radius: 8px; margin-bottom: 12px; font-size: 13px; border-left: 3px solid #ffc107;">
                ⚠️ ${warningText}
            </div>`;
            
            console.warn(`Currency mismatch: requested ${requestedCurrency}, received ${responseCurrency}`, {
                requested: requestedCurrency,
                received: responseCurrency,
                flights: flights.length
            });
        }
    }

    let paxInfo = "";
    if (pax > 1) {
        const paxInfoFn = t("paxInfo");
        const paxText = typeof paxInfoFn === "function" ? paxInfoFn(pax) : `Prices shown for ${pax} passengers`;
        paxInfo = `<div class="pax-info">${paxText}</div>`;
    }

    const cardsHtml = flights.map((flight, i) => renderFlightCard(flight, yearMode, monthKeyFromFlight, i, requestedCurrency)).join('');
    container.innerHTML = paxInfo + currencyWarning + cardsHtml;
    renderAffiliateSection(container.parentElement, {});
}

export function escapeHtml(str) {
    return String(str || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export function renderMenu(container, items, onPick) {
    container.innerHTML = "";
    if (!items.length) return;

    const menu = document.createElement("div");
    menu.className = "menu";

    items.slice(0, 10).forEach((p) => {
        const name = (p.name || "").trim();
        const country = (p.country_name || "").trim();
        const code = ((p.code || "") + "").toUpperCase();
        const type = (p.type || "").toLowerCase();
        const subtitleRaw = (p.city_name || p.airport_name || "").trim();

        const titleText = country ? `${name}, ${country}` : name;
        const subtitleText = subtitleRaw || (type ? type.toUpperCase() : "");

        const icon = (type === "airport") ? "🛬" : "🏙️";
        const iconClass = (type === "airport") ? "airport" : "city";

        const item = document.createElement("div");
        item.className = "item";
        item.title = `${titleText}${subtitleText ? " — " + subtitleText : ""} (${code})`;

        item.innerHTML = `
          <div class=\"left\">
            <div class=\"titleRow\">
              <div class=\"icon ${escapeHtml(iconClass)}\">${icon}</div>
              <div class=\"title\">${escapeHtml(titleText)}</div>
            </div>
            <div class=\"subtitle\">${escapeHtml(subtitleText)}</div>
          </div>
          <div class=\"right\">
            <div class=\"iata\">${escapeHtml(code)}</div>
            <div class=\"pill ${escapeHtml(type)}\">${escapeHtml(type || "")}</div>
          </div>
        `;

        item.addEventListener("mousedown", (e) => {
            e.preventDefault();
            onPick(p);
        });

        menu.appendChild(item);
    });

    container.appendChild(menu);
}

export function updateDirectionSummary(origin, destination) {
    const summary = document.getElementById("directionSummary");
    if (origin && destination) {
        summary.textContent = `${origin} → ${destination}`;
    } else if (origin || destination) {
        summary.textContent = `${origin || "___"} → ${destination || "___"}`;
    } else {
        summary.textContent = "";
    }
}

export function showError(message) {
    const resultsEl = getResultsEl();
    resultsEl.innerHTML = `<div class=\"errorBox\">${escapeHtml(message)}</div>`;
}

export function setLoading(isLoading) {
    const btn = getSearchButton();
    if (isLoading) {
        btn.disabled = true;
        btn.textContent = t("loading");
        getResultsEl().innerHTML = t("loading");
    } else {
        btn.disabled = false;
        btn.textContent = t("search");
    }
}

/**
 * Smooth scroll to results section with navbar offset.
 * Scrolls when results are rendered (including "no results" and error messages).
 */
export function scrollToResults() {
    const resultsEl = getResultsEl();
    if (!resultsEl) return;
    
    // Check if results container has content (not empty, not just loading)
    const hasContent = resultsEl.innerHTML && 
                       resultsEl.innerHTML.trim() !== "" && 
                       !resultsEl.innerHTML.includes("loading");
    
    if (!hasContent) return;
    
    // Calculate navbar offset dynamically
    const navbar = document.querySelector(".tmx-navbar");
    const navbarHeight = navbar ? navbar.offsetHeight : 72; // fallback to 72px
    const topStripHeight = 12;
    const padding = 16; // small padding for visual spacing
    const offset = navbarHeight + padding;
    
    // Get results position
    const resultsTop = resultsEl.getBoundingClientRect().top + window.pageYOffset;
    const targetPosition = resultsTop - offset;
    
    // Smooth scroll
    window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
    });
}
