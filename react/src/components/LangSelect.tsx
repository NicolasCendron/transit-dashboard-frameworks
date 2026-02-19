import { useLocale } from "@/hooks/useLocale";
import CustomSelect from "./CustomSelect";
import type { Locale } from "@common/i18n/locale";

export default function LangSelect() {
  const { locale, localeOptions, setLocale } = useLocale();

  const options = localeOptions.map(o => ({ value: o.code, label: `${o.flag} ${o.label}` }));

  return (
    <CustomSelect
      value={locale as string}
      options={options}
      className="lang-select"
      renderTrigger={opt => opt?.label ?? ""}
      renderOption={opt => opt?.label ?? ""}
      onChange={val => setLocale(val as Locale)}
    />
  );
}
