import { memo } from "react";
import { useLocale } from "@/hooks/useLocale";
import { useTimezone } from "@/hooks/useTimezone";
import { formatCompactDateTime, formatDuration, isNextDay } from "@common/utils/time";
import type { Trip } from "@common/models/trip";
import TripStatusBadge from "./TripStatusBadge";

interface Props {
  trips: Trip[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onCancel: (id: number) => void;
}

function TripTable({ trips, onView, onEdit, onCancel }: Props) {
  const { t } = useLocale();
  const { timezone } = useTimezone();
  return (
    <div className="card">
      <table className="table" aria-label={t("trips.title")}>
        <thead>
          <tr>
            <th scope="col">{t("table.origin")}</th>
            <th scope="col">{t("table.destination")}</th>
            <th scope="col">{t("table.departure")}</th>
            <th scope="col">{t("table.arrival")}</th>
            <th scope="col">{t("table.status")}</th>
            <th scope="col">{t("table.duration")}</th>
            <th scope="col">{t("table.driver")}</th>
            <th scope="col">{t("table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {trips.map(trip => (
            <tr key={trip.id} className="table-row-clickable" onClick={() => onView(trip.id)}>
              <td>{trip.origin}</td>
              <td>{trip.destination}</td>
              <td className="time-cell">{formatCompactDateTime(trip.departureTime, timezone)}</td>
              <td className="time-cell">
                {trip.arrivalTime ? (
                  <>
                    {formatCompactDateTime(trip.arrivalTime, timezone)}
                    {isNextDay(trip.departureTime, trip.departureTimezone, trip.arrivalTime, trip.arrivalTimezone || '') && (
                      <span className="next-day" aria-label="next day">+1</span>
                    )}
                  </>
                ) : (
                  <span className="text-secondary">—</span>
                )}
              </td>
              <td><TripStatusBadge status={trip.status} /></td>
              <td className="text-secondary">
                {trip.arrivalTime ? formatDuration(trip.departureTime, trip.arrivalTime) : "—"}
              </td>
              <td>{trip.driver}</td>
              <td>
                <div className="actions">
                  <button className="btn btn-sm" aria-label={`${t("action.view")} ${trip.origin} to ${trip.destination}`} onClick={e => { e.stopPropagation(); onView(trip.id); }}>{t("action.view")}</button>
                  <button className="btn btn-sm" aria-label={`${t("action.edit")} ${trip.origin} to ${trip.destination}`} onClick={e => { e.stopPropagation(); onEdit(trip.id); }}>{t("action.edit")}</button>
                  {trip.status !== "cancelled" && trip.status !== "arrived" && (
                    <button className="btn btn-sm btn-danger" aria-label={`${t("action.cancel")} ${trip.origin} to ${trip.destination}`} onClick={e => { e.stopPropagation(); onCancel(trip.id); }}>{t("action.cancel")}</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(TripTable);
