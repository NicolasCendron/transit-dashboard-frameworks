import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTripStore } from "@/store/tripStore";
import { useLocale } from "@/hooks/useLocale";
import SearchFilter from "@/components/SearchFilter";
import TripTable from "@/components/TripTable";
import TripTableSkeleton from "@/components/TripTableSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
export default function TripsList() {
    const store = useTripStore();
    const navigate = useNavigate();
    const { t } = useLocale();
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [status, setStatus] = useState("");
    useEffect(() => { store.fetchTrips(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const filteredTrips = useMemo(() => {
        let result = store.trips;
        const query = search.toLowerCase();
        if (query)
            result = result.filter(trip => trip.origin.toLowerCase().includes(query) ||
                trip.destination.toLowerCase().includes(query) ||
                trip.driver.toLowerCase().includes(query));
        if (dateFrom) {
            const from = new Date(dateFrom).getTime();
            if (!isNaN(from))
                result = result.filter(trip => new Date(trip.departureTime).getTime() >= from);
        }
        if (dateTo) {
            const to = new Date(dateTo + "T23:59:59").getTime();
            if (!isNaN(to))
                result = result.filter(trip => new Date(trip.departureTime).getTime() <= to);
        }
        if (status)
            result = result.filter(trip => trip.status === status);
        return result;
    }, [store.trips, search, dateFrom, dateTo, status]);
    const setters = { search: setSearch, dateFrom: setDateFrom, dateTo: setDateTo, status: setStatus };
    function handleChange(field, value) {
        setters[field](value);
    }
    async function handleCancel(id) {
        if (!confirm(t("trips.cancelConfirm")))
            return;
        await store.cancelTrip(id);
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex-between mb-2", children: [_jsx("h2", { className: "page-title", children: t("trips.title") }), _jsx("button", { className: "btn btn-primary", onClick: () => navigate("/trips/new"), children: t("trips.create") })] }), _jsx(SearchFilter, { search: search, dateFrom: dateFrom, dateTo: dateTo, status: status, onChange: handleChange }), store.loading ? (_jsx(TripTableSkeleton, {})) : store.error ? (_jsx(ErrorMessage, { message: t("trips.error"), onRetry: () => store.fetchTrips() })) : filteredTrips.length === 0 ? (_jsx("div", { className: "empty", children: t("trips.empty") })) : (_jsx(TripTable, { trips: filteredTrips, onView: id => navigate(`/trips/${id}`), onEdit: id => navigate(`/trips/${id}/edit`), onCancel: handleCancel }))] }));
}
