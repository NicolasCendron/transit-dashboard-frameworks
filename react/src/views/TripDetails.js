import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTripStore } from "@/store/tripStore";
import { useLocale } from "@/hooks/useLocale";
import { formatCompactDateTime, formatDuration, isNextDay } from "@common/utils/time";
import TripStatusBadge from "@/components/TripStatusBadge";
import TripDetailsSkeleton from "@/components/TripDetailsSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
export default function TripDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const store = useTripStore();
    const { t } = useLocale();
    const numId = Number(id);
    useEffect(() => { if (numId)
        store.fetchTrip(numId); }, [id]);
    if (store.loading)
        return _jsx(TripDetailsSkeleton, {});
    if (store.error)
        return _jsx(ErrorMessage, { message: t("detail.notFound"), onRetry: () => store.fetchTrip(numId) });
    if (!store.currentTrip)
        return null;
    const trip = store.currentTrip;
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex-between mb-2", children: [_jsx("h2", { className: "page-title", children: t("detail.title") }), _jsxs("div", { className: "actions", children: [_jsx(Link, { to: `/trips/${trip.id}/edit`, className: "btn btn-primary", children: t("action.edit") }), _jsx("button", { className: "btn btn-secondary", onClick: () => navigate("/trips"), children: t("action.back") })] })] }), _jsx("div", { className: "card", children: _jsxs("div", { className: "detail-grid", children: [_jsxs("div", { className: "detail-item", children: [_jsx("label", { children: t("table.origin") }), _jsx("span", { children: trip.origin })] }), _jsxs("div", { className: "detail-item", children: [_jsx("label", { children: t("table.destination") }), _jsx("span", { children: trip.destination })] }), _jsxs("div", { className: "detail-item", children: [_jsx("label", { children: t("table.departure") }), _jsx("span", { children: formatCompactDateTime(trip.departureTime, trip.departureTimezone) })] }), _jsxs("div", { className: "detail-item", children: [_jsx("label", { children: t("table.arrival") }), trip.arrivalTime && trip.arrivalTimezone ? (_jsxs("span", { children: [formatCompactDateTime(trip.arrivalTime, trip.arrivalTimezone), isNextDay(trip.departureTime, trip.departureTimezone, trip.arrivalTime, trip.arrivalTimezone) && (_jsx("span", { className: "next-day", children: "+1" }))] })) : (_jsx("span", { className: "text-secondary", children: "\u2014" }))] }), _jsxs("div", { className: "detail-item", children: [_jsx("label", { children: t("table.status") }), _jsx(TripStatusBadge, { status: trip.status })] }), trip.arrivalTime && (_jsxs("div", { className: "detail-item", children: [_jsx("label", { children: t("table.duration") }), _jsx("span", { children: formatDuration(trip.departureTime, trip.arrivalTime) })] })), _jsxs("div", { className: "detail-item", children: [_jsx("label", { children: t("table.driver") }), _jsx("span", { children: trip.driver })] })] }) })] }));
}
