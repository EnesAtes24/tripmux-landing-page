import { fetchPlaces, fetchTopCheapest } from "../api/flightsApi.js";
import { getDateMode, getDepartureAtValue, setDateMode } from "./state.js";
import {
    getOriginInput,
    getDestinationInput,
    getResultsEl,
    getPassengersInput,
    getPassengersValue,
    clampPassengersInput,
    renderFlights,
    renderMenu,
    showError,
    setLoading,
    updateDirectionSummary,
    scrollToResults
} from "./dom.js";
import { normalizeIata, isValidIata } from "../utils/validate.js";
import { getEffectiveCurrency, getLang, t } from "../i18n/locale.js";

function debounce(fn, delay = 250) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function monthKeyFromFlight(f) {
    const d = (f && f.date) ? String(f.date) : "";
    if (d.length >= 7) return d.substring(0, 7);
    return "";
}

function pickCheapestPerMonth(list) {
    const map = new Map();
    for (const f of list) {
        const mk = monthKeyFromFlight(f);
        if (!mk) continue;

        const current = map.get(mk);
        if (!current || (typeof f.price === "number" && f.price < current.price)) {
            map.set(mk, f);
        }
    }

    return Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map((e) => e[1])
        .slice(0, 12);
}

function setupAutocomplete(inputId, suggestId) {
    const input = document.getElementById(inputId);
    const suggest = document.getElementById(suggestId);

    const close = () => (suggest.innerHTML = "");

    const onInput = debounce(async () => {
        const term = input.value.trim();
        updateDirectionSummary(
            normalizeIata(getOriginInput().value),
            normalizeIata(getDestinationInput().value)
        );
        if (term.length < 2) return close();

        const places = await fetchPlaces(term, getLang());
        renderMenu(suggest, places, (p) => {
            input.value = (p.code || "").toUpperCase();
            close();
            updateDirectionSummary(
                normalizeIata(getOriginInput().value),
                normalizeIata(getDestinationInput().value)
            );
        });
    }, 250);

    input.addEventListener("input", onInput);
    input.addEventListener("blur", () => {
        input.value = normalizeIata(input.value);
        updateDirectionSummary(
            normalizeIata(getOriginInput().value),
            normalizeIata(getDestinationInput().value)
        );
    });
    input.addEventListener("blur", () => setTimeout(close, 120));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

export async function searchFlights() {
    const originInput = getOriginInput();
    const destinationInput = getDestinationInput();
    const origin = normalizeIata(originInput.value);
    const destination = normalizeIata(destinationInput.value);
    const departureAt = getDepartureAtValue();
    const currency = getEffectiveCurrency(); // Always use resolved currency for API

    if (!origin || !destination || !departureAt) {
        showError(t("fillAll"));
        return;
    }

    if (!isValidIata(origin) || !isValidIata(destination)) {
        showError(t("iataError"));
        return;
    }

    if (origin === destination) {
        showError(t("sameRoute"));
        return;
    }

    originInput.value = origin;
    destinationInput.value = destination;
    updateDirectionSummary(origin, destination);

    const passengers = getPassengersValue();

    // Debug log for currency verification
    console.debug(`[Tripmux] Search request: currency=${currency}, origin=${origin}, destination=${destination}, departureAt=${departureAt}, passengers=${passengers}`);

    setLoading(true);

    try {
        if (getDateMode() === "year") {
            const raw = await fetchTopCheapest({ origin, destination, departureAt, currency, limit: 12, passengers });
            console.debug(`[Tripmux] Year mode response: ${raw.length} flights, first currency: ${raw[0]?.currency || 'N/A'}`);
            const monthly = pickCheapestPerMonth(raw);
            renderFlights(getResultsEl(), monthly, true, monthKeyFromFlight, passengers);
        } else {
            const data = await fetchTopCheapest({ origin, destination, departureAt, currency, passengers });
            console.debug(`[Tripmux] Response: ${data.length} flights, first currency: ${data[0]?.currency || 'N/A'}`);
            renderFlights(getResultsEl(), data, false, monthKeyFromFlight, passengers);
        }
        
        // Auto-scroll to results after rendering (with small delay to ensure DOM is updated)
        setTimeout(() => {
            scrollToResults();
        }, 100);
    } catch (err) {
        showError(err.message || "Error fetching flights.");
        // Also scroll to error message
        setTimeout(() => {
            scrollToResults();
        }, 100);
    } finally {
        setLoading(false);
    }
}

function swapRoute() {
    const originInput = getOriginInput();
    const destinationInput = getDestinationInput();
    const origin = normalizeIata(originInput.value);
    const destination = normalizeIata(destinationInput.value);

    originInput.value = destination;
    destinationInput.value = origin;
    updateDirectionSummary(destination, origin);
}

export function bindEvents() {
    document.getElementById("mode-day").addEventListener("click", () => setDateMode("day"));
    document.getElementById("mode-month").addEventListener("click", () => setDateMode("month"));
    document.getElementById("mode-year").addEventListener("click", () => setDateMode("year"));
    document.getElementById("searchBtn").addEventListener("click", searchFlights);
    document.getElementById("swapBtn").addEventListener("click", swapRoute);

    // Passengers +/- buttons and input validation
    const paxInput = getPassengersInput();
    const paxMinus = document.getElementById("paxMinus");
    const paxPlus = document.getElementById("paxPlus");

    if (paxMinus && paxInput) {
        paxMinus.addEventListener("click", () => {
            const cur = getPassengersValue();
            if (cur > 1) paxInput.value = String(cur - 1);
        });
    }
    if (paxPlus && paxInput) {
        paxPlus.addEventListener("click", () => {
            const cur = getPassengersValue();
            if (cur < 9) paxInput.value = String(cur + 1);
        });
    }
    if (paxInput) {
        paxInput.addEventListener("blur", clampPassengersInput);
        paxInput.addEventListener("change", clampPassengersInput);
    }

    setupAutocomplete("origin", "origin-suggest");
    setupAutocomplete("destination", "destination-suggest");

    setDateMode("day");
    updateDirectionSummary(
        normalizeIata(getOriginInput().value),
        normalizeIata(getDestinationInput().value)
    );
}
