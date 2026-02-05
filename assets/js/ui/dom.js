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

/**
 * Inject flight card styles into page head (self-contained rendering)
 * Guarantees styles even if external CSS fails
 */
function injectFlightCardStyles() {
    if (!document.getElementById('flight-card-styles')) {
        const style = document.createElement('style');
        style.id = 'flight-card-styles';
        style.textContent = `.results-list{display:flex;flex-direction:column;gap:16px;max-width:980px;margin:18px auto 40px auto;padding:0 16px;} .flight-card{background:#fff;border-radius:18px;padding:22px 24px;box-shadow:0 10px 30px rgba(0,0,0,.18);color:#0A1A3E;text-align:left;} .flight-header{font-size:22px;font-weight:800;margin:0 0 12px 0;display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;} .flight-code{font-size:16px;font-weight:700;color:rgba(10,26,62,.55);} .flight-meta{display:flex;flex-direction:column;gap:10px;margin:0 0 16px 0;color:rgba(10,26,62,.78);font-size:16px;font-weight:600;} .meta-row{display:flex;align-items:center;gap:10px;} .meta-ico{width:20px;height:20px;opacity:.75;flex:0 0 auto;} .flight-price{font-size:36px;font-weight:900;color:#0B5BFF;margin:0 0 14px 0;} .partner-btn{display:inline-flex;align-items:center;gap:10px;background:#00A3FF;color:#fff;padding:12px 16px;border-radius:14px;text-decoration:none;font-weight:800;font-size:16px;} .partner-btn:hover{filter:brightness(.95);} .partner-btn svg{width:18px;height:18px;opacity:.95;} .partner-note{margin-top:12px;color:rgba(10,26,62,.45);font-style:italic;font-size:14px;} @media(max-width:768px){ .flight-card{padding:18px 16px;border-radius:16px;} .flight-header{font-size:18px;} .flight-price{font-size:30px;} .partner-btn{font-size:14px;padding:10px 12px;border-radius:12px;} .partner-note{font-size:13px;} }`;
        document.head.appendChild(style);
    }
}

/**
 * Render a single flight card with exact class names and inline SVG icons
 */
function renderFlightCard(flight, yearMode, monthKeyFromFlight) {
    const monthLabel = yearMode ? ` <span class="flight-code">(${monthKeyFromFlight(flight)})</span>` : "";
    
    return `
        <div class="flight-card">
            <div class="flight-header">
                <span>${flight.airlineName}</span>
                <span class="flight-code">(${flight.airlineCode})</span>
                ${monthLabel}
            </div>
            
            <div class="flight-meta">
                <div class="meta-row">
                    <svg class="meta-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7h10M7 17h10M10 10l-3-3 3-3M14 14l3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span>${flight.from} → ${flight.to}</span>
                </div>
                
                <div class="meta-row">
                    <svg class="meta-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span>${flight.date || "—"}</span>
                </div>
                
                <div class="meta-row">
                    <svg class="meta-ico" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2"/></svg>
                    <span>${flight.durationMinutes} min</span>
                </div>
            </div>
            
            <div class="flight-price">€${flight.price}</div>
            
            <a href="${flight.aviasalesUrl}" target="_blank" rel="noopener noreferrer" class="partner-btn">
                Open on partner site
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 3h7v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            
            <div class="partner-note">Purchase is completed on the partner's website.</div>
        </div>
    `;
}

export function renderFlights(container, flights, yearMode, monthKeyFromFlight) {
    // Inject styles into head (self-contained, guaranteed to work)
    injectFlightCardStyles();
    
    // Set container class and clear previous results
    container.className = 'results-list';
    container.innerHTML = "";

    if (!flights || flights.length === 0) {
        container.innerHTML = "No results.";
        return;
    }

    // Render all flight cards
    const cardsHtml = flights.map(flight => renderFlightCard(flight, yearMode, monthKeyFromFlight)).join('');
    container.innerHTML = cardsHtml;
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
