import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from "react";
import { useLocale } from "@/hooks/useLocale";
import { tripStatusFilterOptions as statusOptions } from "@common/models/tripStatusOptions";
import StatusSelect from "./StatusSelect";
export default function SearchFilter({ search, dateFrom, dateTo, status, onChange }) {
    const { t } = useLocale();
    const onSearch = useCallback((e) => onChange("search", e.target.value), [onChange]);
    const onDateFrom = useCallback((e) => onChange("dateFrom", e.target.value), [onChange]);
    const onDateTo = useCallback((e) => onChange("dateTo", e.target.value), [onChange]);
    const onStatus = useCallback((v) => onChange("status", v), [onChange]);
    return (_jsxs("div", { className: "filters-bar", children: [_jsxs("div", { className: "filter-group filter-search", children: [_jsx("label", { className: "filter-label", children: t("trips.search") }), _jsx("input", { type: "text", className: "filter-input", placeholder: t("trips.search"), value: search, onChange: onSearch })] }), _jsxs("div", { className: "filter-group", children: [_jsx("label", { className: "filter-label", children: t("trips.dateFrom") }), _jsx("input", { type: "date", className: "filter-input", value: dateFrom, onChange: onDateFrom })] }), _jsxs("div", { className: "filter-group", children: [_jsx("label", { className: "filter-label", children: t("trips.dateTo") }), _jsx("input", { type: "date", className: "filter-input", value: dateTo, onChange: onDateTo })] }), _jsxs("div", { className: "filter-group", children: [_jsx("label", { className: "filter-label", children: t("table.status") }), _jsx(StatusSelect, { value: status, options: statusOptions, onChange: onStatus })] })] }));
}
