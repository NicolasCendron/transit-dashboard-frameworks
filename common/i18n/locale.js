export const LOCALES = [
    { code: "en", flag: "\u{1F1EC}\u{1F1E7}" },
    { code: "es", flag: "\u{1F1EA}\u{1F1F8}" },
    { code: "pt", flag: "\u{1F1E7}\u{1F1F7}" },
];
const STORAGE_KEY = "transit-dashboard-lang";
export function getDefaultLocale() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es" || stored === "pt")
        return stored;
    const lang = navigator.language;
    if (lang.startsWith("pt"))
        return "pt";
    if (lang.startsWith("es"))
        return "es";
    return "en";
}
export function setStoredLocale(locale) {
    localStorage.setItem(STORAGE_KEY, locale);
}
