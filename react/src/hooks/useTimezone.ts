import { useTimezoneStore } from "@/store/timezoneStore";
import { TIMEZONE_OPTIONS } from "@common/utils/timezone";

export function useTimezone() {
  const { timezone, setTimezone } = useTimezoneStore();
  const currentLabel = TIMEZONE_OPTIONS.find(o => o.value === timezone)?.label ?? "CET";
  return { timezone, timezoneOptions: TIMEZONE_OPTIONS, currentLabel, setTimezone };
}
