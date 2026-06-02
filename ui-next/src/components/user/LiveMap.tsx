import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import type { Tracking } from "@/lib/api";
import type { DroneCoords } from "@/lib/useDroneCoords";

interface LiveMapProps {
  tracking?: Tracking;
  droneCoords?: DroneCoords | null;
  live?: boolean;
  droneLabel?: string;
}

// Real OpenStreetMap tile map of the delivery: source, destination, and the live drone.
// CircleMarkers (not image pins) avoid the Leaflet marker-icon asset issue under bundlers.
export function LiveMap({ tracking, droneCoords, live = false, droneLabel = "Drone" }: LiveMapProps) {
  const src: LatLngTuple = tracking ? [tracking.srcLat, tracking.srcLng] : [37.5, 127.0];
  const dest: LatLngTuple = tracking ? [tracking.destLat, tracking.destLng] : [37.51, 127.01];
  const drone: LatLngTuple = droneCoords
    ? [droneCoords.lat, droneCoords.lng]
    : tracking
    ? [tracking.droneLat, tracking.droneLng]
    : [37.505, 127.005];
  const bounds: LatLngBoundsExpression = [src, dest, drone];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-4 w-4" /> Live Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-72 w-full overflow-hidden rounded-lg border">
          <MapContainer
            bounds={bounds}
            boundsOptions={{ padding: [40, 40] }}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline positions={[src, dest]} pathOptions={{ color: "#2563eb", dashArray: "6 6" }} />
            <CircleMarker center={src} radius={8} pathOptions={{ color: "#059669", fillColor: "#059669", fillOpacity: 0.9 }}>
              <Tooltip>Source</Tooltip>
            </CircleMarker>
            <CircleMarker center={dest} radius={8} pathOptions={{ color: "#dc2626", fillColor: "#dc2626", fillOpacity: 0.9 }}>
              <Tooltip>Destination</Tooltip>
            </CircleMarker>
            <CircleMarker center={drone} radius={9} pathOptions={{ color: "#1d4ed8", fillColor: "#3b82f6", fillOpacity: 1 }}>
              <Tooltip permanent>{droneLabel}</Tooltip>
            </CircleMarker>
          </MapContainer>
          <div className="pointer-events-none absolute bottom-2 right-2 z-[1000] rounded bg-background/80 px-2 py-1 text-[10px] text-muted-foreground">
            {live ? "Live WS feed" : "no live feed"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
