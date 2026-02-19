import { useCallback } from "react";
import { useLocale } from "@/hooks/useLocale";
import { tripStatusFilterOptions as statusOptions } from "@common/models/tripStatusOptions";
import StatusSelect from "./StatusSelect";

interface Props {
  search: string;
  dateFrom: string;
  dateTo: string;
  status: string;
  onChange: (field: "search" | "dateFrom" | "dateTo" | "status", value: string) => void;
}

export default function SearchFilter({ search, dateFrom, dateTo, status, onChange }: Props) {
  const { t } = useLocale();
  const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onChange("search", e.target.value), [onChange]);
  const onDateFrom = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onChange("dateFrom", e.target.value), [onChange]);
  const onDateTo = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onChange("dateTo", e.target.value), [onChange]);
  const onStatus = useCallback((v: string) => onChange("status", v), [onChange]);
  return (
    <div className="filters-bar">
      <div className="filter-group filter-search">
        <label className="filter-label">{t("trips.search")}</label>
        <input type="text" className="filter-input" placeholder={t("trips.search")} value={search} onChange={onSearch} />
      </div>
      <div className="filter-group">
        <label className="filter-label">{t("trips.dateFrom")}</label>
        <input type="date" className="filter-input" value={dateFrom} onChange={onDateFrom} />
      </div>
      <div className="filter-group">
        <label className="filter-label">{t("trips.dateTo")}</label>
        <input type="date" className="filter-input" value={dateTo} onChange={onDateTo} />
      </div>
      <div className="filter-group">
        <label className="filter-label">{t("table.status")}</label>
        <StatusSelect value={status} options={statusOptions} onChange={onStatus} />
      </div>
    </div>
  );
}
