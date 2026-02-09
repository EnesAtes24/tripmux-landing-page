import { API_BASE } from "../config/env.js";

export async function fetchTopCheapest({ origin, destination, departureAt, currency, limit, passengers }) {
    const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    const url = new URL(`${base}/flights/cheapest/top`, window.location.origin);
    url.searchParams.set("origin", origin);
    url.searchParams.set("destination", destination);
    url.searchParams.set("departureAt", departureAt);
    url.searchParams.set("currency", currency);
    if (limit !== undefined && limit !== null) {
        url.searchParams.set("limit", String(limit));
    }
    if (passengers !== undefined && passengers !== null && passengers > 1) {
        url.searchParams.set("passengers", String(passengers));
    }

    const res = await fetch(url.toString());

    if (res.status === 204) return [];

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Request failed (${res.status}). ${text}`);
    }

    const text = await res.text().catch(() => "");
    if (!text) return [];
    try {
        const data = JSON.parse(text);
        return Array.isArray(data) ? data : [];
    } catch (e) {
        return [];
    }
}

export async function fetchPlaces(term, locale = "en") {
    const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    const url = new URL(`${base}/places/autocomplete`, window.location.origin);
    url.searchParams.set("term", term);
    url.searchParams.set("locale", locale);

    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}
