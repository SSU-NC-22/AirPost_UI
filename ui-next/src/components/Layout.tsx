import { NavLink, Outlet } from "react-router-dom";
import { Plane, LayoutDashboard, PackagePlus, MapPin, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Admin", icon: LayoutDashboard },
  { to: "/register", label: "Register Parcel", icon: PackagePlus },
  { to: "/track/AP-DEMO1", label: "Track", icon: MapPin },
  { to: "/kibana", label: "Sensors", icon: BarChart3 },
];

export function Layout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
          <div className="flex items-center gap-2 font-semibold">
            <div className="rounded-md bg-primary p-1.5 text-primary-foreground">
              <Plane className="h-5 w-5" />
            </div>
            AirPost
          </div>
          <nav className="flex gap-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
