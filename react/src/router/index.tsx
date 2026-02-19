import { Routes, Route, Navigate } from "react-router-dom";
import TripsList from "@/views/TripsList";
import TripDetails from "@/views/TripDetails";
import TripForm from "@/views/TripForm";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/trips" replace />} />
      <Route path="/trips" element={<TripsList />} />
      <Route path="/trips/new" element={<TripForm />} />
      <Route path="/trips/:id" element={<TripDetails />} />
      <Route path="/trips/:id/edit" element={<TripForm />} />
      <Route path="*" element={<Navigate to="/trips" replace />} />
    </Routes>
  );
}
