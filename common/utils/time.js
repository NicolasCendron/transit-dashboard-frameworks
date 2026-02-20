/**
 * Format a UTC ISO string into local time for a given IANA timezone.
 * Returns e.g. "14:30 WET" or "15:30 CET"
 */
export function formatLocalTime(utcIso, timezone) {
    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
        timeZoneName: "short",
    }).format(new Date(utcIso));
}
/**
 * Format a UTC ISO string into compact date+time with timezone abbreviation.
 * Returns e.g. "20/02/26 14:30 CET"
 */
export function formatCompactDateTime(utcIso, timezone) {
    const date = new Date(utcIso);
    const formatter = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
        timeZoneName: "short",
    });
    return formatter.format(date);
}
/**
 * Format a UTC ISO string into a short date + local time for a given timezone.
 * Returns e.g. "20/02/2026 14:30 WET"
 */
export function formatLocalDateTime(utcIso, timezone) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
        timeZoneName: "short",
    }).format(new Date(utcIso));
}
/**
 * Returns duration string between two UTC ISO strings, e.g. "2h 30m" or "1d 5h 30m"
 */
export function formatDuration(departureUtc, arrivalUtc) {
    const diffMs = new Date(arrivalUtc).getTime() - new Date(departureUtc).getTime();
    if (diffMs <= 0)
        return "—";
    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    }
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
/**
 * Returns true if arrival is exactly 1 calendar day after departure,
 * both evaluated in their respective timezones.
 */
export function isNextDay(departureUtc, departureTimezone, arrivalUtc, arrivalTimezone) {
    const depDate = new Date(departureUtc);
    const arrDate = new Date(arrivalUtc);
    const depFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: departureTimezone });
    const arrFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: arrivalTimezone });
    const depDay = depFormatter.format(depDate);
    const arrDay = arrFormatter.format(arrDate);
    const diffDays = Math.floor((Date.parse(arrDay) - Date.parse(depDay)) / 86400000);
    return diffDays === 1;
}
