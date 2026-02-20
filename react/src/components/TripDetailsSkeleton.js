import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DETAIL_FIELDS_COUNT = 7; // origin, destination, departure, arrival, status, duration, driver
export default function TripDetailsSkeleton() {
    return (_jsx("div", { className: "card", children: _jsx("div", { className: "detail-grid", children: Array.from({ length: DETAIL_FIELDS_COUNT }).map((_, i) => (_jsxs("div", { className: "detail-item", children: [_jsx("div", { className: "skeleton skeleton-text", style: { width: 80, height: 14, marginBottom: 8 } }), _jsx("div", { className: "skeleton skeleton-text", style: { width: 180, height: 16 } })] }, i))) }) }));
}
