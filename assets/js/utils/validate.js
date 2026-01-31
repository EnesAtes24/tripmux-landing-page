export function normalizeIata(value) {
    return String(value || "")
        .replace(/[^a-zA-Z]/g, "")
        .toUpperCase()
        .slice(0, 3);
}

export function isValidIata(value) {
    return /^[A-Z]{3}$/.test(value);
}
