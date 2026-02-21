export interface TimezoneOption {
  value: string;
  label: string;
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris',  label: 'CET' },
  { value: 'Europe/Athens', label: 'EET' },
];

const STORAGE_KEY = 'transit-dashboard-timezone';

export function getDefaultTimezone(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (TIMEZONE_OPTIONS.some(o => o.value === stored)) return stored!;
  const browser = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (TIMEZONE_OPTIONS.some(o => o.value === browser)) return browser;
  return 'Europe/Paris';
}

export function setStoredTimezone(timezone: string): void {
  localStorage.setItem(STORAGE_KEY, timezone);
}
