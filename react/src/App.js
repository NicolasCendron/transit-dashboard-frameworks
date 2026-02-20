import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AppRouter from "@/router";
import AppHeader from "@/components/AppHeader";
import ErrorBoundary from "@/components/ErrorBoundary";
export default function App() {
    return (_jsxs(ErrorBoundary, { children: [_jsx(AppHeader, {}), _jsx("main", { className: "container", children: _jsx(ErrorBoundary, { children: _jsx(AppRouter, {}) }) })] }));
}
