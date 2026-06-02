import { Plane, MapPin, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tracking } from "@/lib/api";
import type { DroneCoords } from "@/lib/useDroneCoords";

interface MapPlaceholderProps {
  // When supplied, the drone marker is positioned from real coordinates;
  // otherwise it sits at the animated mid-route placeholder spot.
  tracking?: Tracking;
  droneCoords?: DroneCoords | null;
  live?: boolean;
  droneLabel?: string;
}

// Projects a lat/lng onto the 0..100% box using the source/destination corners
// as bounds, so the live drone marker tracks between origin and destination.
function project(
  lat: number,
  lng: number,
  t: Tracking
): { leftPct: number; topPct: number } {
  const span = (a: number, b: number) => (a === b ? 1 : b - a);
  const xRatio = (lng - t.srcLng) / span(t.srcLng, t.destLng);
  const yRatio = (lat - t.srcLat) / span(t.srcLat, t.destLat);
  // Origin sits bottom-left (left 15%, top 72%), destination top-right.
  const leftPct = 15 + clamp01(xRatio) * 70;
  const topPct = 72 - clamp01(yRatio) * 46;
  return { leftPct, topPct };
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

// Live map. Real drone coordinates arrive via the health-check WebSocket; when
// none are available it renders the animated placeholder route.
export function MapPlaceholder({
  tracking,
  droneCoords,
  live = false,
  droneLabel = "Drone",
}: MapPlaceholderProps) {
  const dronePos =
    tracking && droneCoords
      ? project(droneCoords.lat, droneCoords.lng, tracking)
      : { leftPct: 48, topPct: 48 };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-4 w-4" /> Live Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-72 w-full overflow-hidden rounded-lg border bg-[linear-gradient(135deg,#eef2ff_0%,#e0f2fe_100%)]">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#94a3b8_1px,transparent_1px),linear-gradient(90deg,#94a3b8_1px,transparent_1px)] [background-size:32px_32px]" />

          {/* origin */}
          <div className="absolute left-[12%] top-[70%] flex flex-col items-center text-xs">
            <MapPin className="h-6 w-6 text-emerald-600" />
            <span className="font-medium">Source</span>
          </div>

          {/* destination */}
          <div className="absolute right-[12%] top-[22%] flex flex-col items-center text-xs">
            <MapPin className="h-6 w-6 text-destructive" />
            <span className="font-medium">Destination</span>
          </div>

          {/* route line */}
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <line
              x1="15%"
              y1="72%"
              x2="85%"
              y2="26%"
              stroke="hsl(221 83% 53%)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
          </svg>

          {/* drone marker */}
          <div
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-all duration-700"
            style={{ left: `${dronePos.leftPct}%`, top: `${dronePos.topPct}%` }}
          >
            <div className="rounded-full bg-primary p-2 text-primary-foreground shadow-lg">
              <Plane className="h-5 w-5" />
            </div>
            <span className="mt-1 rounded bg-background/90 px-1.5 py-0.5 text-xs font-medium">
              {droneLabel}
            </span>
          </div>

          <div className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-1 text-[10px] text-muted-foreground">
            {live ? "Live WS feed" : "Map placeholder — no live feed"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
