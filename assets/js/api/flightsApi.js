import { API_BASE } from "../config/env.js";

export async function fetchTopCheapest({ origin, destination, departureAt, currency, limit }) {
    const url = new URL(`${API_BASE}/api/flights/cheapest/top`);
    url.searchParams.set("origin", origin);
    url.searchParams.set("destination", destination);
    url.searchParams.set("departureAt", departureAt);
    url.searchParams.set("currency", currency);
    if (limit !== undefined && limit !== null) {
        url.searchParams.set("limit", String(limit));
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

export async function fetchPlaces(term) {
    const url = new URL(`${API_BASE}/api/places/autocomplete`);
    url.searchParams.set("term", term);
    url.searchParams.set("locale", "tr");

    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}
