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

export function setHint(text) {
    document.getElementById("hint").textContent = text || "";
}

export function updateGhostPlaceholder() {
    const wrap = document.getElementById("dateWrap");
    const input = getDepartureInput();
    const isEmpty = !input.value || String(input.value).trim() === "";
    wrap.classList.toggle("is-empty", isEmpty);
}

export function renderFlights(container, flights, yearMode, monthKeyFromFlight) {
    container.innerHTML = "";

    if (!flights || flights.length === 0) {
        container.innerHTML = "No results.";
        return;
    }

    flights.forEach(flight => {
        const monthLabel = yearMode ? ` <span style=\"opacity:.7;font-weight:700;\">(${monthKeyFromFlight(flight)})</span>` : "";
        container.innerHTML += `
          <div class=\"card\">
            <div class=\"card-airline\"><strong>${flight.airlineName}</strong> <span class=\"airline-code\">(${flight.airlineCode})</span>${monthLabel}</div>
            <div class=\"card-info-row\">
              <svg class=\"info-icon\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">
                <path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path>
                <polyline points=\"7.5 4.21 12 6.81 16.5 4.21\"></polyline>
                <polyline points=\"7.5 19.79 7.5 14.6 3 12\"></polyline>
                <polyline points=\"21 12 16.5 14.6 16.5 19.79\"></polyline>
                <polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline>
                <line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line>
              </svg>
              <span class=\"info-text\">${flight.from} → ${flight.to}</span>
            </div>
            <div class=\"card-info-row\">
              <svg class=\"info-icon\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">
                <rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect>
                <line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line>
                <line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line>
                <line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line>
              </svg>
              <span class=\"info-text\">${flight.date || "—"}</span>
            </div>
            <div class=\"card-info-row\">
              <svg class=\"info-icon\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">
                <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>
                <polyline points=\"12 6 12 12 16 14\"></polyline>
              </svg>
              <span class=\"info-text\">${flight.durationMinutes} min</span>
            </div>
            <div class=\"price\">€${flight.price}</div>
            <a href=\"${flight.aviasalesUrl}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"cta-button\">
              Open on partner site
              <svg class=\"external-icon\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">
                <path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path>
                <polyline points=\"15 3 21 3 21 9\"></polyline>
                <line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"></line>
              </svg>
            </a>
            <p class=\"card-disclaimer\">Purchase is completed on the partner's website.</p>
          </div>
        `;
    });
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
        btn.textContent = "Loading...";
        getResultsEl().innerHTML = "Loading...";
    } else {
        btn.disabled = false;
        btn.textContent = "Search";
    }
}
