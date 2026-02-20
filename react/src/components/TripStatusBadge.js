import { jsx as _jsx } from "react/jsx-runtime";
import { useLocale } from "@/hooks/useLocale";
export default function TripStatusBadge({ status }) {
    const { t } = useLocale();
    return _jsx("span", { className: `badge badge-${status}`, role: "status", "aria-label": t(`status.${status}`), children: t(`status.${status}`) });
}
