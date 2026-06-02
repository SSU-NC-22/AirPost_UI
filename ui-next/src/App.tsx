import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Layout } from "@/components/Layout";
import { Login } from "@/pages/Login";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { KibanaDashboard } from "@/pages/KibanaDashboard";
import { RegisterParcel } from "@/pages/RegisterParcel";
import { TrackParcel } from "@/pages/TrackParcel";
import { isAuthed, isAdmin } from "@/lib/api";

/** Gate a route behind login (and optionally the admin role). */
function RequireAuth({ children, admin }: { children: ReactNode; admin?: boolean }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  if (admin && !isAdmin()) return <Navigate to="/register" replace />;
  return <>{children}</>;
}

/** Send a logged-in user to their default screen by role; otherwise to login. */
function Home() {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin() ? "/admin" : "/register"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/admin"
            element={
              <RequireAuth admin>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/kibana"
            element={
              <RequireAuth admin>
                <KibanaDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/register"
            element={
              <RequireAuth>
                <RegisterParcel />
              </RequireAuth>
            }
          />
          <Route
            path="/track/:trackingNumber"
            element={
              <RequireAuth>
                <TrackParcel />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
