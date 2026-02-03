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
            <div><strong>${flight.airlineName}</strong> (${flight.airlineCode})${monthLabel}</div>
            <div>${flight.from} → ${flight.to}</div>
            <div>Date: ${flight.date || "—"} | Duration: ${flight.durationMinutes} min</div>
            <div class=\"price\">€${flight.price}</div>
            <a href=\"${flight.aviasalesUrl}\" target=\"_blank\">View ticket on partner site</a>
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
