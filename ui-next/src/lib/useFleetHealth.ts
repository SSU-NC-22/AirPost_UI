// React hook that subscribes to the health-check WebSocket and tracks the live state of EVERY
// node it hears about (drones, stations, tags). The admin dashboard uses it to observe the fleet
// in real time (online/battery/position). If the socket never connects, `connected` stays false.

import { useEffect, useRef, useState } from "react";
import { HEALTH_CHECK_WS_URL, type HealthFrame, type NodeState } from "@/lib/api";

export interface FleetHealth {
  /** Latest state per node id (most recent health frame wins). */
  nodes: Map<number, NodeState>;
  connected: boolean;
}

export function useFleetHealth(): FleetHealth {
  const [connected, setConnected] = useState(false);
  const [nodes, setNodes] = useState<Map<number, NodeState>>(new Map());
  const latest = useRef<Map<number, NodeState>>(new Map());

  useEffect(() => {
    let socket: WebSocket;
    try {
      socket = new WebSocket(HEALTH_CHECK_WS_URL);
    } catch {
      return;
    }
    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onerror = () => setConnected(false);
    socket.onmessage = (event) => {
      if (typeof event.data !== "string") return;
      let frame: HealthFrame;
      try {
        frame = JSON.parse(event.data);
      } catch {
        return;
      }
      const states = frame.healthinfo?.state;
      if (!Array.isArray(states)) return;
      for (const s of states) latest.current.set(s.nid, s);
      setNodes(new Map(latest.current)); // new ref so React re-renders
    };
    return () => socket.close();
  }, []);

  return { nodes, connected };
}

/** Map a LiPo pack voltage (≈14–16.8 V) to a rough 0–100% charge for display. */
export function batteryPercent(voltage: number): number {
  const pct = ((voltage - 14.0) / (16.8 - 14.0)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}
