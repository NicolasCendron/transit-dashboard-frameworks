import { create } from "zustand";
import { TIMEZONE_OPTIONS, getDefaultTimezone, setStoredTimezone } from "@common/utils/timezone";

interface TimezoneStore {
  timezone: string;
  setTimezone: (tz: string) => void;
}

export const useTimezoneStore = create<TimezoneStore>((set) => ({
  timezone: getDefaultTimezone(),
  setTimezone: (tz: string) => {
    setStoredTimezone(tz);
    set({ timezone: tz });
  },
}));
