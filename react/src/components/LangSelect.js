import { jsx as _jsx } from "react/jsx-runtime";
import { useLocale } from "@/hooks/useLocale";
import CustomSelect from "./CustomSelect";
export default function LangSelect() {
    const { locale, localeOptions, setLocale } = useLocale();
    const options = localeOptions.map(o => ({ value: o.code, label: `${o.flag} ${o.label}` }));
    return (_jsx(CustomSelect, { value: locale, options: options, className: "lang-select", renderTrigger: opt => opt?.label ?? "", renderOption: opt => opt?.label ?? "", onChange: val => setLocale(val) }));
}
