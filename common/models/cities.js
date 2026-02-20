export const EUROPEAN_CITIES = [
    { name: "Amsterdam", timezone: "Europe/Amsterdam" },
    { name: "Athens", timezone: "Europe/Athens" },
    { name: "Barcelona", timezone: "Europe/Madrid" },
    { name: "Berlin", timezone: "Europe/Berlin" },
    { name: "Brussels", timezone: "Europe/Brussels" },
    { name: "Bucharest", timezone: "Europe/Bucharest" },
    { name: "Budapest", timezone: "Europe/Budapest" },
    { name: "Copenhagen", timezone: "Europe/Copenhagen" },
    { name: "Dublin", timezone: "Europe/Dublin" },
    { name: "Helsinki", timezone: "Europe/Helsinki" },
    { name: "Lisbon", timezone: "Europe/Lisbon" },
    { name: "Ljubljana", timezone: "Europe/Ljubljana" },
    { name: "London", timezone: "Europe/London" },
    { name: "Madrid", timezone: "Europe/Madrid" },
    { name: "Milan", timezone: "Europe/Rome" },
    { name: "Oslo", timezone: "Europe/Oslo" },
    { name: "Paris", timezone: "Europe/Paris" },
    { name: "Prague", timezone: "Europe/Prague" },
    { name: "Riga", timezone: "Europe/Riga" },
    { name: "Rome", timezone: "Europe/Rome" },
    { name: "Sofia", timezone: "Europe/Sofia" },
    { name: "Stockholm", timezone: "Europe/Stockholm" },
    { name: "Tallinn", timezone: "Europe/Tallinn" },
    { name: "Vienna", timezone: "Europe/Vienna" },
    { name: "Vilnius", timezone: "Europe/Vilnius" },
    { name: "Warsaw", timezone: "Europe/Warsaw" },
    { name: "Zagreb", timezone: "Europe/Zagreb" },
    { name: "Zurich", timezone: "Europe/Zurich" },
];
const CITY_TIMEZONE_MAP = new Map(EUROPEAN_CITIES.map(c => [c.name, c.timezone]));
export function timezoneForCity(name) {
    return CITY_TIMEZONE_MAP.get(name) ?? "UTC";
}
/** Returns a UTC offset string like "+2" or "+0" for a given IANA timezone at the current moment. */
export function utcOffsetLabel(timezone) {
    const parts = new Intl.DateTimeFormat("en", {
        timeZone: timezone,
        timeZoneName: "shortOffset",
    }).formatToParts(new Date());
    const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";
    // raw is like "GMT+2", "GMT+1", "GMT" (for +0)
    return raw.replace("GMT", "") || "+0";
}
/** Returns timezone abbreviation like "CET", "WET", "GMT" for a given IANA timezone. */
export function timezoneAbbr(timezone) {
    const parts = new Intl.DateTimeFormat("en", {
        timeZone: timezone,
        timeZoneName: "short",
    }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value ?? "UTC";
}
