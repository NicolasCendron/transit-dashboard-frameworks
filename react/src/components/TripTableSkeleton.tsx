import { useLocale } from "@/hooks/useLocale";

export default function TripTableSkeleton() {
  const { t } = useLocale();
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>{t("table.origin")}</th>
            <th>{t("table.destination")}</th>
            <th>{t("table.departure")}</th>
            <th>{t("table.arrival")}</th>
            <th>{t("table.status")}</th>
            <th>{t("table.duration")}</th>
            <th>{t("table.driver")}</th>
            <th>{t("table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              <td><div className="skeleton skeleton-text" /></td>
              <td><div className="skeleton skeleton-text" /></td>
              <td><div className="skeleton skeleton-text" /></td>
              <td><div className="skeleton skeleton-text" /></td>
              <td><div className="skeleton skeleton-badge" /></td>
              <td><div className="skeleton skeleton-text-sm" /></td>
              <td><div className="skeleton skeleton-text" /></td>
              <td><div className="skeleton skeleton-actions" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
