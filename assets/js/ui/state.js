import { setHint, updateGhostPlaceholder } from "./dom.js";
import { getTodayDateValue, getCurrentMonthValue } from "../utils/date.js";
import { t } from "../i18n/locale.js";

let dateMode = "day"; // day | month | year

export function getDateMode() {
    return dateMode;
}

function setActiveMode(mode) {
    document.getElementById("mode-day").classList.toggle("active", mode === "day");
    document.getElementById("mode-month").classList.toggle("active", mode === "month");
    document.getElementById("mode-year").classList.toggle("active", mode === "year");
}

export function setDateMode(mode) {
    dateMode = mode;
    setActiveMode(mode);

    const wrap = document.getElementById("dateWrap");
    const input = document.createElement("input");
    input.id = "departureAt";

    if (mode === "day") {
        input.type = "date"; // locale UI
        input.value = getTodayDateValue();
        setHint("");
    } else if (mode === "month") {
        input.type = "month"; // locale UI
        input.value = getCurrentMonthValue();
        setHint("");
    } else {
        const nowYear = new Date().getFullYear();
        input.type = "number";
        input.placeholder = "----";
        input.min = "1900";
        input.max = String(nowYear + 5);
        input.step = "1";
        input.value = String(nowYear);
        input.inputMode = "numeric";
        setHint(t("yearModeHint"));
    }

    input.addEventListener("input", updateGhostPlaceholder);
    input.addEventListener("change", updateGhostPlaceholder);

    wrap.replaceChildren(input);
    updateGhostPlaceholder();
}

export function getDepartureAtValue() {
    const v = document.getElementById("departureAt").value.trim();
    if (!v) return "";

    if (dateMode === "year") {
        const year = v.replace(/[^\d]/g, "").slice(0, 4);
        return year;
    }

    return v; // day: YYYY-MM-DD, month: YYYY-MM
}
