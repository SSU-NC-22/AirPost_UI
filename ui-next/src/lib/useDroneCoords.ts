// React hook that subscribes to the health-check WebSocket and reports the
// live position of a specific drone node. If the socket never connects (no
// backend), `connected` stays false so callers can show a placeholder.

import { useEffect, useState } from "react";
import { HEALTH_CHECK_WS_URL, type HealthFrame } from "@/lib/api";

export interface DroneCoords {
  lat: number;
  lng: number;
  alt: number;
}

export interface DroneCoordsState {
  coords: DroneCoords | null;
  connected: boolean;
}

/**
 * Tracks one drone's coordinates from the health-check stream.
 * @param droneNid backend node id of the drone to follow (null disables the sub).
 */
export function useDroneCoords(droneNid: number | null): DroneCoordsState {
  const [coords, setCoords] = useState<DroneCoords | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (droneNid == null) return;

    let socket: WebSocket;
    try {
      socket = new WebSocket(HEALTH_CHECK_WS_URL);
    } catch {
      return; // Construction can throw on a malformed URL; stay disconnected.
    }

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onerror = () => setConnected(false);
    socket.onmessage = (event) => {
      const next = extractCoords(event.data, droneNid);
      if (next) setCoords(next);
    };

    return () => socket.close();
  }, [droneNid]);

  return { coords, connected };
}

/** Parses a health frame and returns the target drone's coords, if present. */
function extractCoords(raw: unknown, droneNid: number): DroneCoords | null {
  if (typeof raw !== "string") return null;
  let frame: HealthFrame;
  try {
    frame = JSON.parse(raw);
  } catch {
    return null;
  }
  const node = frame.healthinfo?.state?.find((s) => s.nid === droneNid);
  if (!node || !Array.isArray(node.location) || node.location.length < 2) {
    return null;
  }
  const [lat, lng, alt = 0] = node.location;
  return { lat, lng, alt };
}
