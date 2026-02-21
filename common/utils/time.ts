import { toZonedTime, fromZonedTime } from "date-fns-tz";

/**
 * Format a UTC ISO string into local time for a given IANA timezone.
 * Returns e.g. "14:30 WET" or "15:30 CET"
 */
export function formatLocalTime(utcIso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit", minute: "2-digit",
    timeZone: timezone, timeZoneName: "short",
  }).format(new Date(utcIso));
}

/**
 * Format a UTC ISO string into compact date+time with timezone abbreviation.
 * Returns e.g. "20/02/26 14:30 CET"
 */
export function formatCompactDateTime(utcIso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
    timeZone: timezone, timeZoneName: "short",
  }).format(new Date(utcIso));
}

/**
 * Format a UTC ISO string into a short date + local time for a given timezone.
 * Returns e.g. "20/02/2026 14:30 WET"
 */
export function formatLocalDateTime(utcIso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: timezone, timeZoneName: "short",
  }).format(new Date(utcIso));
}

/**
 * Returns duration string between two UTC ISO strings, e.g. "2h 30m" or "1d 5h 30m"
 */
export function formatDuration(departureUtc: string, arrivalUtc: string): string {
  const diffMs = new Date(arrivalUtc).getTime() - new Date(departureUtc).getTime();
  if (diffMs <= 0) return "—";
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
 * Convert UTC ISO string to datetime-local format in a specific timezone.
 * Returns e.g. "2026-02-20T14:30" for use in <input type="datetime-local">
 */
export function utcToLocalInput(utcIso: string, timezone: string): string {
  const zoned = toZonedTime(new Date(utcIso), timezone);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${zoned.getFullYear()}-${pad(zoned.getMonth() + 1)}-${pad(zoned.getDate())}T${pad(zoned.getHours())}:${pad(zoned.getMinutes())}`;
}

/**
 * Convert datetime-local input value to UTC ISO string, interpreting it as a time in the given timezone.
 * Input: "2026-02-20T14:30", timezone: "Europe/Paris" (CET = UTC+1)
 * Output: "2026-02-20T13:30:00.000Z"
 */
export function localInputToUtc(localInput: string, timezone: string): string {
  return fromZonedTime(localInput, timezone).toISOString();
}

/**
 * Returns true if arrival is exactly 1 calendar day after departure,
 * both evaluated in their respective timezones.
 */
export function isNextDay(
  departureUtc: string,
  departureTimezone: string,
  arrivalUtc: string,
  arrivalTimezone: string,
): boolean {
  const fmt = (utc: string, tz: string) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date(utc));
  const diffDays = Math.floor((Date.parse(fmt(arrivalUtc, arrivalTimezone)) - Date.parse(fmt(departureUtc, departureTimezone))) / 86400000);
  return diffDays === 1;
}
