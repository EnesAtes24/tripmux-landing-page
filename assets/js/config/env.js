export const API_BASE = (() => {
    const params = new URLSearchParams(window.location.search);
    const override = params.get("apiBase");
    if (override) return decodeURIComponent(override);

    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
        return window.location.origin;
    }

    if (host === "tripmux.com" || host === "www.tripmux.com") {
        return "https://tripmux-api.onrender.com";
    }

    return "https://tripmux-api.onrender.com";
})();
