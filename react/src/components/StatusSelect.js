import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocale } from "@/hooks/useLocale";
import { tripStatusFilterOptions as statusOptions } from "@common/models/tripStatusOptions";
import CustomSelect from "./CustomSelect";
function badgeClass(value) {
    return value ? `badge-${value}` : "badge-select-all";
}
export default function StatusSelect({ value, options = statusOptions, onChange }) {
    const { t } = useLocale();
    const mapped = options.map(o => ({ value: o.value, label: t(o.label) }));
    return (_jsx(CustomSelect, { value: value, options: mapped, onChange: onChange, renderTrigger: opt => (_jsxs("span", { className: `badge status-select-trigger-badge ${badgeClass(opt?.value ?? "")}`, children: [opt?.label, " ", _jsx("span", { children: "\u25BE" })] })), renderOption: opt => (_jsx("span", { className: `badge status-select-option ${badgeClass(opt.value)}`, children: opt.label })) }));
}
