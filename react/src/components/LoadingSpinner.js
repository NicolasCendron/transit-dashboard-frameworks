import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function LoadingSpinner({ message }) {
    return (_jsxs("div", { className: "loading", children: [_jsx("div", { className: "spinner" }), message] }));
}
