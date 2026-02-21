import { useTimezone } from "@/hooks/useTimezone";
import CustomSelect from "./CustomSelect";

export default function TimezoneSelect() {
  const { timezone, timezoneOptions, setTimezone } = useTimezone();
  return (
    <CustomSelect
      value={timezone}
      options={timezoneOptions}
      className="timezone-select"
      renderTrigger={opt => `🌍 ${opt?.label ?? ""}`}
      renderOption={opt => opt?.label ?? ""}
      onChange={setTimezone}
    />
  );
}
