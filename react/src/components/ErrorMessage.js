import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocale } from "@/hooks/useLocale";
export default function ErrorMessage({ message, onRetry }) {
    const { t } = useLocale();
    return (_jsxs("div", { className: "error", children: [_jsx("p", { children: message }), onRetry && (_jsx("button", { className: "btn btn-primary mt-2", onClick: onRetry, children: t("trips.retry") }))] }));
}
