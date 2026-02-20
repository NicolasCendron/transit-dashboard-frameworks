import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import TripsList from "@/views/TripsList";
import TripDetails from "@/views/TripDetails";
import TripForm from "@/views/TripForm";
export default function AppRouter() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/trips", replace: true }) }), _jsx(Route, { path: "/trips", element: _jsx(TripsList, {}) }), _jsx(Route, { path: "/trips/new", element: _jsx(TripForm, {}) }), _jsx(Route, { path: "/trips/:id", element: _jsx(TripDetails, {}) }), _jsx(Route, { path: "/trips/:id/edit", element: _jsx(TripForm, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/trips", replace: true }) })] }));
}
