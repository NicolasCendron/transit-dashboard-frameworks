import { useLocale } from "@/hooks/useLocale";
import { tripStatusFilterOptions as statusOptions } from "@common/models/tripStatusOptions";
import CustomSelect from "./CustomSelect";

function badgeClass(value: string) {
  return value ? `badge-${value}` : "badge-select-all";
}

interface Props {
  value: string;
  options?: typeof statusOptions;
  onChange: (value: string) => void;
}

export default function StatusSelect({ value, options = statusOptions, onChange }: Props) {
  const { t } = useLocale();
  const mapped = options.map(o => ({ value: o.value, label: t(o.label) }));

  return (
    <CustomSelect
      value={value}
      options={mapped}
      onChange={onChange}
      renderTrigger={opt => (
        <span className={`badge status-select-trigger-badge ${badgeClass(opt?.value ?? "")}`}>
          {opt?.label} <span>▾</span>
        </span>
      )}
      renderOption={opt => (
        <span className={`badge status-select-option ${badgeClass(opt.value)}`}>{opt.label}</span>
      )}
    />
  );
}
