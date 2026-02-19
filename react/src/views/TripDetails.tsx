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
  useEffect(() => { if (numId) store.fetchTrip(numId); }, [id]);

  if (store.loading) return <TripDetailsSkeleton />;
  if (store.error) return <ErrorMessage message={t("detail.notFound")} onRetry={() => store.fetchTrip(numId)} />;
  if (!store.currentTrip) return null;

  const trip = store.currentTrip;

  return (
    <div>
      <div className="flex-between mb-2">
        <h2 className="page-title">{t("detail.title")}</h2>
        <div className="actions">
          <Link to={`/trips/${trip.id}/edit`} className="btn btn-primary">{t("action.edit")}</Link>
          <button className="btn btn-secondary" onClick={() => navigate("/trips")}>{t("action.back")}</button>
        </div>
      </div>

      <div className="card">
        <div className="detail-grid">
          <div className="detail-item">
            <label>{t("table.origin")}</label>
            <span>{trip.origin}</span>
          </div>
          <div className="detail-item">
            <label>{t("table.destination")}</label>
            <span>{trip.destination}</span>
          </div>
          <div className="detail-item">
            <label>{t("table.departure")}</label>
            <span>{formatCompactDateTime(trip.departureTime, trip.departureTimezone)}</span>
          </div>
          <div className="detail-item">
            <label>{t("table.arrival")}</label>
            {trip.arrivalTime && trip.arrivalTimezone ? (
              <span>
                {formatCompactDateTime(trip.arrivalTime, trip.arrivalTimezone)}
                {isNextDay(trip.departureTime, trip.departureTimezone, trip.arrivalTime, trip.arrivalTimezone) && (
                  <span className="next-day">+1</span>
                )}
              </span>
            ) : (
              <span className="text-secondary">—</span>
            )}
          </div>
          <div className="detail-item">
            <label>{t("table.status")}</label>
            <TripStatusBadge status={trip.status} />
          </div>
          {trip.arrivalTime && (
            <div className="detail-item">
              <label>{t("table.duration")}</label>
              <span>{formatDuration(trip.departureTime, trip.arrivalTime)}</span>
            </div>
          )}
          <div className="detail-item">
            <label>{t("table.driver")}</label>
            <span>{trip.driver}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
