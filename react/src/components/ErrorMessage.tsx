import { useLocale } from "@/hooks/useLocale";

interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: Props) {
  const { t } = useLocale();
  return (
    <div className="error">
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-primary mt-2" onClick={onRetry}>
          {t("trips.retry")}
        </button>
      )}
    </div>
  );
}
