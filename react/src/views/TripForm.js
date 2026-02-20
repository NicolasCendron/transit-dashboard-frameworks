import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTripStore } from "@/store/tripStore";
import { useLocale } from "@/hooks/useLocale";
import { EUROPEAN_CITIES, timezoneForCity, timezoneAbbr } from "@common/models/cities";
import { tripStatusOptions } from "@common/models/tripStatusOptions";
import { formatDuration } from "@common/utils/time";
import { validateTripForm } from "@common/utils/validation";
import TripFormSkeleton from "@/components/TripFormSkeleton";
import StatusSelect from "@/components/StatusSelect";
const emptyForm = { origin: "", destination: "", departureTime: "", arrivalTime: "", status: "scheduled", driver: "" };
export default function TripForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const store = useTripStore();
    const { t } = useLocale();
    const isEdit = !!id;
    const tripId = Number(id);
    const [form, setForm] = useState({ ...emptyForm });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        if (!isEdit)
            return;
        store.fetchTrip(tripId).then(() => {
            const trip = store.currentTrip;
            if (trip)
                setForm({
                    origin: trip.origin,
                    destination: trip.destination,
                    departureTime: trip.departureTime.slice(0, 16),
                    arrivalTime: trip.arrivalTime ? trip.arrivalTime.slice(0, 16) : "",
                    status: trip.status,
                    driver: trip.driver,
                });
        });
    }, [id]);
    function update(field, value) {
        setForm(f => {
            const next = { ...f, [field]: value };
            if (field === "status" && f.status === "arrived" && value !== "arrived")
                next.arrivalTime = "";
            return next;
        });
    }
    const departureTimezone = timezoneForCity(form.origin);
    const arrivalTimezone = timezoneForCity(form.destination);
    const duration = useMemo(() => {
        if (!form.departureTime || !form.arrivalTime)
            return "—";
        try {
            return formatDuration(new Date(form.departureTime).toISOString(), new Date(form.arrivalTime).toISOString());
        }
        catch {
            return "—";
        }
    }, [form.departureTime, form.arrivalTime]);
    async function handleSubmit(e) {
        e.preventDefault();
        const errs = validateTripForm(form, t);
        setErrors(errs);
        if (Object.keys(errs).length > 0)
            return;
        setSubmitting(true);
        try {
            const payload = {
                origin: form.origin,
                destination: form.destination,
                departureTime: new Date(form.departureTime).toISOString(),
                departureTimezone,
                arrivalTime: form.arrivalTime ? new Date(form.arrivalTime).toISOString() : undefined,
                arrivalTimezone,
                status: form.status,
                driver: form.driver,
            };
            if (isEdit) {
                await store.updateTrip(tripId, payload);
                navigate(`/trips/${tripId}`);
            }
            else {
                await store.createTrip(payload);
                navigate("/trips");
            }
        }
        finally {
            setSubmitting(false);
        }
    }
    if (isEdit && store.loading)
        return _jsx(TripFormSkeleton, {});
    return (_jsxs("div", { children: [_jsx("h2", { className: "page-title", children: isEdit ? t("form.editTitle") : t("form.createTitle") }), _jsxs("form", { className: "card", onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t("form.origin") }), _jsxs("select", { className: `form-select${errors.origin ? " is-invalid" : ""}`, value: form.origin, onChange: e => update("origin", e.target.value), children: [_jsx("option", { value: "", disabled: true, children: "\u2014" }), EUROPEAN_CITIES.map(city => (_jsxs("option", { value: city.name, children: [city.name, " (", timezoneAbbr(city.timezone), ")"] }, city.name)))] }), errors.origin && _jsx("p", { className: "form-error", children: errors.origin })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t("form.destination") }), _jsxs("select", { className: `form-select${errors.destination ? " is-invalid" : ""}`, value: form.destination, onChange: e => update("destination", e.target.value), children: [_jsx("option", { value: "", disabled: true, children: "\u2014" }), EUROPEAN_CITIES.map(city => (_jsxs("option", { value: city.name, children: [city.name, " (", timezoneAbbr(city.timezone), ")"] }, city.name)))] }), errors.destination && _jsx("p", { className: "form-error", children: errors.destination })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: [t("form.departureTime"), departureTimezone && _jsxs("span", { className: "form-tz-hint", children: [" ", timezoneAbbr(departureTimezone)] })] }), _jsx("input", { type: "datetime-local", className: `form-input${errors.departureTime ? " is-invalid" : ""}`, value: form.departureTime, onChange: e => update("departureTime", e.target.value) }), errors.departureTime && _jsx("p", { className: "form-error", children: errors.departureTime })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t("form.status") }), _jsx(StatusSelect, { value: form.status, options: tripStatusOptions, onChange: v => update("status", v) })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: [t("form.arrivalTime"), arrivalTimezone && _jsxs("span", { className: "form-tz-hint", children: [" ", timezoneAbbr(arrivalTimezone)] })] }), _jsx("input", { type: "datetime-local", className: `form-input form-input-disableable${errors.arrivalTime ? " is-invalid" : ""}`, value: form.arrivalTime, disabled: form.status !== "arrived", title: form.status !== "arrived" ? t("form.arrivalRequiredWhenArrived") : "", onChange: e => update("arrivalTime", e.target.value) }), errors.arrivalTime && _jsx("p", { className: "form-error", children: errors.arrivalTime })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t("table.duration") }), _jsx("input", { type: "text", className: "form-input", value: duration, disabled: true, readOnly: true })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: t("form.driver") }), _jsx("input", { type: "text", className: `form-input${errors.driver ? " is-invalid" : ""}`, value: form.driver, onChange: e => update("driver", e.target.value) }), errors.driver && _jsx("p", { className: "form-error", children: errors.driver })] }), _jsxs("div", { className: "flex gap-1 mt-3", children: [_jsx("button", { type: "submit", className: "btn btn-primary", disabled: submitting, children: submitting ? (isEdit ? t("action.saving") : t("action.creating")) : t("action.save") }), _jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => navigate(isEdit ? `/trips/${tripId}` : "/trips"), children: t("action.back") })] })] })] }));
}
