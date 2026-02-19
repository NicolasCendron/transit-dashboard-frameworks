import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTripStore } from "@/store/tripStore";
import { useLocale } from "@/hooks/useLocale";
import { EUROPEAN_CITIES, timezoneForCity, utcOffsetLabel } from "@common/models/cities";
import { tripStatusOptions } from "@common/models/tripStatusOptions";
import { formatDuration } from "@common/utils/time";
import { validateTripForm } from "@common/utils/validation";
import type { TripStatus } from "@common/models/trip";
import TripFormSkeleton from "@/components/TripFormSkeleton";
import StatusSelect from "@/components/StatusSelect";

const emptyForm = { origin: "", destination: "", departureTime: "", arrivalTime: "", status: "scheduled" as TripStatus, driver: "" };

export default function TripForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useTripStore();
  const { t } = useLocale();

  const isEdit = !!id;
  const tripId = Number(id);

  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    store.fetchTrip(tripId).then(() => {
      const trip = store.currentTrip;
      if (trip) setForm({
        origin: trip.origin,
        destination: trip.destination,
        departureTime: trip.departureTime.slice(0, 16),
        arrivalTime: trip.arrivalTime ? trip.arrivalTime.slice(0, 16) : "",
        status: trip.status,
        driver: trip.driver,
      });
    });
  }, [id]);

  function update<K extends keyof typeof emptyForm>(field: K, value: typeof emptyForm[K]) {
    setForm(f => {
      const next = { ...f, [field]: value };
      if (field === "status" && f.status === "arrived" && value !== "arrived") next.arrivalTime = "";
      return next;
    });
  }

  const departureTimezone = timezoneForCity(form.origin);
  const arrivalTimezone = timezoneForCity(form.destination);

  const duration = useMemo(() => {
    if (!form.departureTime || !form.arrivalTime) return "—";
    try { return formatDuration(new Date(form.departureTime).toISOString(), new Date(form.arrivalTime).toISOString()); }
    catch { return "—"; }
  }, [form.departureTime, form.arrivalTime]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateTripForm(form, t);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
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
      } else {
        await store.createTrip(payload);
        navigate("/trips");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (isEdit && store.loading) return <TripFormSkeleton />;

  return (
    <div>
      <h2 className="page-title">{isEdit ? t("form.editTitle") : t("form.createTitle")}</h2>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t("form.origin")}</label>
            <select className={`form-select${errors.origin ? " is-invalid" : ""}`} value={form.origin} onChange={e => update("origin", e.target.value)}>
              <option value="" disabled>—</option>
              {EUROPEAN_CITIES.map(city => (
                <option key={city.name} value={city.name}>{city.name} ({city.timezone} {utcOffsetLabel(city.timezone)})</option>
              ))}
            </select>
            {errors.origin && <p className="form-error">{errors.origin}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">{t("form.destination")}</label>
            <select className={`form-select${errors.destination ? " is-invalid" : ""}`} value={form.destination} onChange={e => update("destination", e.target.value)}>
              <option value="" disabled>—</option>
              {EUROPEAN_CITIES.map(city => (
                <option key={city.name} value={city.name}>{city.name} ({city.timezone} {utcOffsetLabel(city.timezone)})</option>
              ))}
            </select>
            {errors.destination && <p className="form-error">{errors.destination}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              {t("form.departureTime")}
              {departureTimezone && <span className="form-tz-hint"> {departureTimezone} {utcOffsetLabel(departureTimezone)}</span>}
            </label>
            <input type="datetime-local" className={`form-input${errors.departureTime ? " is-invalid" : ""}`} value={form.departureTime} onChange={e => update("departureTime", e.target.value)} />
            {errors.departureTime && <p className="form-error">{errors.departureTime}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">{t("form.status")}</label>
            <StatusSelect value={form.status} options={tripStatusOptions} onChange={v => update("status", v as TripStatus)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              {t("form.arrivalTime")}
              {arrivalTimezone && <span className="form-tz-hint"> {arrivalTimezone} {utcOffsetLabel(arrivalTimezone)}</span>}
            </label>
            <input
              type="datetime-local"
              className={`form-input form-input-disableable${errors.arrivalTime ? " is-invalid" : ""}`}
              value={form.arrivalTime}
              disabled={form.status !== "arrived"}
              title={form.status !== "arrived" ? t("form.arrivalRequiredWhenArrived") : ""}
              onChange={e => update("arrivalTime", e.target.value)}
            />
            {errors.arrivalTime && <p className="form-error">{errors.arrivalTime}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">{t("table.duration")}</label>
            <input type="text" className="form-input" value={duration} disabled readOnly />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{t("form.driver")}</label>
          <input type="text" className={`form-input${errors.driver ? " is-invalid" : ""}`} value={form.driver} onChange={e => update("driver", e.target.value)} />
          {errors.driver && <p className="form-error">{errors.driver}</p>}
        </div>

        <div className="flex gap-1 mt-3">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (isEdit ? t("action.saving") : t("action.creating")) : t("action.save")}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(isEdit ? `/trips/${tripId}` : "/trips")}>
            {t("action.back")}
          </button>
        </div>
      </form>
    </div>
  );
}
