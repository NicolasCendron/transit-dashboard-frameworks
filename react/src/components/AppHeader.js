import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocale } from "@/hooks/useLocale";
import LangSelect from "./LangSelect";
export default function AppHeader() {
    const { t } = useLocale();
    return (_jsxs("header", { className: "app-header flex-between", children: [_jsxs("h1", { children: [t("app.title"), _jsx("span", { className: "framework-badge", children: "React" })] }), _jsx(LangSelect, {})] }));
}
