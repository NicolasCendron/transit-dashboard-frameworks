import { useLocale } from "@/hooks/useLocale";
import type { TripStatus } from "@common/models/trip";

export default function TripStatusBadge({ status }: { status: TripStatus }) {
  const { t } = useLocale();
  return <span className={`badge badge-${status}`} role="status" aria-label={t(`status.${status}`)}>{t(`status.${status}`)}</span>;
}
