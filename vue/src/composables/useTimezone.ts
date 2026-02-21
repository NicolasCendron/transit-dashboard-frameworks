import { ref, computed } from "vue";
import { TIMEZONE_OPTIONS, getDefaultTimezone, setStoredTimezone } from "@common/utils/timezone";

// Module-level ref — shared across all useTimezone() calls (singleton)
const timezone = ref(getDefaultTimezone());

export function useTimezone() {
  const currentLabel = computed(
    () => TIMEZONE_OPTIONS.find(o => o.value === timezone.value)?.label ?? "CET"
  );

  function setTimezone(tz: string) {
    timezone.value = tz;
    setStoredTimezone(tz);
  }

  return { timezone, timezoneOptions: TIMEZONE_OPTIONS, currentLabel, setTimezone };
}
