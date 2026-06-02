import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPlaceholder } from "@/components/user/MapPlaceholder";
import { DeliveryTimeline } from "@/components/user/DeliveryTimeline";
import {
  getTracking,
  trackingToTimeline,
  fallbackTimeline,
  type Tracking,
} from "@/lib/api";
import { useDroneCoords } from "@/lib/useDroneCoords";
import type { TimelineEvent } from "@/data/mock";

export function TrackParcel() {
  const { trackingNumber } = useParams();
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(fallbackTimeline);

  useEffect(() => {
    if (!trackingNumber) return;
    getTracking(trackingNumber).then((t) => {
      setTracking(t);
      setTimeline(trackingToTimeline(t));
    });
  }, [trackingNumber]);

  // Subscribe to the live drone position once we know which drone to follow.
  const { coords, connected } = useDroneCoords(tracking?.droneNid ?? null);
  const droneLabel = tracking ? `Drone #${tracking.droneNid}` : "Drone";

  // Prefer the live WS coordinate; otherwise show the last REST snapshot.
  const droneCoords =
    coords ??
    (tracking
      ? { lat: tracking.droneLat, lng: tracking.droneLng, alt: 0 }
      : null);

  const inFlight = timeline.some((e) => e.state === "active");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Track Parcel</h1>
          <p className="text-sm text-muted-foreground">
            Tracking number{" "}
            <span className="font-mono font-medium text-foreground">
              {trackingNumber ?? "—"}
            </span>
          </p>
        </div>
        <Badge variant={inFlight ? "default" : "success"}>
          {inFlight ? "In flight" : "Idle / delivered"}
        </Badge>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-6 p-5 text-sm">
          <div>
            <div className="text-muted-foreground">Drone</div>
            <div className="font-medium">{droneLabel}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Live feed</div>
            <div className="font-medium">{connected ? "Connected" : "Offline"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Position</div>
            <div className="font-medium">
              {droneCoords
                ? `${droneCoords.lat.toFixed(4)}, ${droneCoords.lng.toFixed(4)}`
                : "—"}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <MapPlaceholder
          tracking={tracking ?? undefined}
          droneCoords={droneCoords}
          live={connected}
          droneLabel={droneLabel}
        />
        <DeliveryTimeline events={timeline} />
      </div>
    </div>
  );
}
