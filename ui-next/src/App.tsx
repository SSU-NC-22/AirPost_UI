import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { RegisterParcel } from "@/pages/RegisterParcel";
import { TrackParcel } from "@/pages/TrackParcel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/register" element={<RegisterParcel />} />
          <Route path="/track/:trackingNumber" element={<TrackParcel />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
