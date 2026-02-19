import { describe, it, expect } from "vitest";
import {
  formatLocalTime,
  formatLocalDateTime,
  formatCompactDateTime,
  formatDuration,
  isNextDay,
} from "../utils/time";
import { utcOffsetLabel, timezoneForCity } from "../models/cities";

describe("formatLocalTime", () => {
  it("formats UTC time in the given timezone", () => {
    const result = formatLocalTime("2026-02-20T12:00:00Z", "Europe/Paris");
    expect(result).toContain("13:00");
    expect(result).toContain("CET");
  });

  it("formats UTC time in WET timezone (Lisbon)", () => {
    const result = formatLocalTime("2026-02-20T12:00:00Z", "Europe/Lisbon");
    expect(result).toContain("12:00");
  });

  it("handles EET timezone (Warsaw, UTC+1 in winter)", () => {
    const result = formatLocalTime("2026-02-20T12:00:00Z", "Europe/Warsaw");
    expect(result).toContain("13:00");
  });
});

describe("formatLocalDateTime", () => {
  it("includes date and time in the result", () => {
    const result = formatLocalDateTime("2026-02-20T12:00:00Z", "Europe/Paris");
    expect(result).toContain("20");
    expect(result).toContain("02");
    expect(result).toContain("2026");
    expect(result).toContain("13:00");
  });
});

describe("formatCompactDateTime", () => {
  it("formats in DD/MM/YY HH:MM (+Z) format", () => {
    const result = formatCompactDateTime("2026-02-20T12:00:00Z", "Europe/Paris");
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{2} \d{2}:\d{2} \([+-]\d+\)/);
    expect(result).toContain("20/02/26");
    expect(result).toContain("13:00");
    expect(result).toContain("(+1)");
  });

  it("handles UTC+0 timezone", () => {
    const result = formatCompactDateTime("2026-02-20T12:00:00Z", "Europe/Lisbon");
    expect(result).toContain("12:00");
    expect(result).toContain("(+0)");
  });

  it("handles UTC+2 timezone", () => {
    const result = formatCompactDateTime("2026-02-20T12:00:00Z", "Europe/Athens");
    expect(result).toContain("14:00");
    expect(result).toContain("(+2)");
  });
});

describe("formatDuration", () => {
  it("returns hours and minutes for a multi-hour trip", () => {
    expect(formatDuration("2026-02-20T08:00:00Z", "2026-02-20T10:30:00Z")).toBe("2h 30m");
  });

  it("returns only minutes for sub-hour trip", () => {
    expect(formatDuration("2026-02-20T08:00:00Z", "2026-02-20T08:45:00Z")).toBe("45m");
  });

  it("returns dash for zero or negative duration", () => {
    expect(formatDuration("2026-02-20T10:00:00Z", "2026-02-20T10:00:00Z")).toBe("—");
    expect(formatDuration("2026-02-20T10:00:00Z", "2026-02-20T09:00:00Z")).toBe("—");
  });

  it("handles exactly 1 hour", () => {
    expect(formatDuration("2026-02-20T08:00:00Z", "2026-02-20T09:00:00Z")).toBe("1h 0m");
  });

  it("formats multi-day durations with days", () => {
    expect(formatDuration("2026-02-20T08:00:00Z", "2026-02-21T10:30:00Z")).toBe("1d 2h 30m");
    expect(formatDuration("2026-02-20T08:00:00Z", "2026-02-22T08:00:00Z")).toBe("2d 0h 0m");
  });

  it("handles exactly 24 hours as 1 day", () => {
    expect(formatDuration("2026-02-20T08:00:00Z", "2026-02-21T08:00:00Z")).toBe("1d 0h 0m");
  });
});

describe("isNextDay", () => {
  it("returns false when arrival is same day as departure", () => {
    expect(isNextDay("2026-02-20T08:00:00Z", "Europe/Lisbon", "2026-02-20T12:00:00Z", "Europe/Madrid")).toBe(false);
  });

  it("returns true for overnight trip crossing midnight", () => {
    expect(isNextDay("2026-02-20T22:00:00Z", "Europe/Lisbon", "2026-02-21T01:00:00Z", "Europe/Paris")).toBe(true);
  });

  it("returns false when same UTC date but different timezones on same calendar day", () => {
    expect(isNextDay("2026-02-20T10:00:00Z", "Europe/London", "2026-02-20T14:00:00Z", "Europe/Warsaw")).toBe(false);
  });

  it("returns false for multi-day trips (2+ days)", () => {
    expect(isNextDay("2026-02-20T08:00:00Z", "Europe/Lisbon", "2026-02-22T08:00:00Z", "Europe/Paris")).toBe(false);
  });

  it("returns false when arrival is before departure", () => {
    expect(isNextDay("2026-02-21T08:00:00Z", "Europe/Lisbon", "2026-02-20T08:00:00Z", "Europe/Paris")).toBe(false);
  });
});

describe("utcOffsetLabel", () => {
  it("returns +0 for UTC timezone", () => {
    expect(utcOffsetLabel("UTC")).toBe("+0");
  });

  it("returns +1 for CET timezone in winter", () => {
    expect(utcOffsetLabel("Europe/Paris")).toMatch(/[+-]\d+/);
  });

  it("returns +2 for EET timezone", () => {
    expect(utcOffsetLabel("Europe/Athens")).toMatch(/[+-]\d+/);
  });
});

describe("timezoneForCity", () => {
  it("returns correct timezone for known city", () => {
    expect(timezoneForCity("Lisbon")).toBe("Europe/Lisbon");
    expect(timezoneForCity("Paris")).toBe("Europe/Paris");
    expect(timezoneForCity("Athens")).toBe("Europe/Athens");
  });

  it("returns UTC for unknown city", () => {
    expect(timezoneForCity("UnknownCity")).toBe("UTC");
  });

  it("is case-sensitive", () => {
    expect(timezoneForCity("lisbon")).toBe("UTC");
    expect(timezoneForCity("LISBON")).toBe("UTC");
  });
});
