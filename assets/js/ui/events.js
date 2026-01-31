import { fetchPlaces, fetchTopCheapest } from "../api/flightsApi.js";
import { getDateMode, getDepartureAtValue, setDateMode } from "./state.js";
import {
    getOriginInput,
    getDestinationInput,
    getResultsEl,
    renderFlights,
    renderMenu,
    showError,
    setLoading,
    updateDirectionSummary
} from "./dom.js";
import { normalizeIata, isValidIata } from "../utils/validate.js";

function debounce(fn, delay = 250) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
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

        const places = await fetchPlaces(term);
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

async function searchFlights() {
    const originInput = getOriginInput();
    const destinationInput = getDestinationInput();
    const origin = normalizeIata(originInput.value);
    const destination = normalizeIata(destinationInput.value);
    const departureAt = getDepartureAtValue();
    const currency = "EUR";

    if (!origin || !destination || !departureAt) {
        showError("Please fill all fields.");
        return;
    }

    if (!isValidIata(origin) || !isValidIata(destination)) {
        showError("Origin and destination must be exactly 3 letters (A-Z).");
        return;
    }

    if (origin === destination) {
        showError("Origin and destination cannot be the same.");
        return;
    }

    originInput.value = origin;
    destinationInput.value = destination;
    updateDirectionSummary(origin, destination);

    setLoading(true);

    try {
        if (getDateMode() === "year") {
            const raw = await fetchTopCheapest({ origin, destination, departureAt, currency, limit: 12 });
            const monthly = pickCheapestPerMonth(raw);
            renderFlights(getResultsEl(), monthly, true, monthKeyFromFlight);
        } else {
            const data = await fetchTopCheapest({ origin, destination, departureAt, currency });
            renderFlights(getResultsEl(), data, false, monthKeyFromFlight);
        }
    } catch (err) {
        showError(err.message || "Error fetching flights.");
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

    setupAutocomplete("origin", "origin-suggest");
    setupAutocomplete("destination", "destination-suggest");

    setDateMode("day");
    updateDirectionSummary(
        normalizeIata(getOriginInput().value),
        normalizeIata(getDestinationInput().value)
    );
}
