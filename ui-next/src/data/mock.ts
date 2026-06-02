// Mock data for the AirPost UI scaffold. No backend wiring — Phase 4 placeholder.

export type HealthStatus = "online" | "degraded" | "offline";

export interface Drone {
  id: string;
  name: string;
  model: string;
  battery: number; // percent
  status: HealthStatus;
  lastSeen: string;
}

export interface Station {
  id: string;
  name: string;
  location: string;
  capacity: number;
  inUse: number;
  status: HealthStatus;
}

export interface Tag {
  id: string;
  parcelId: string;
  uid: string;
  assignedTo: string;
  status: HealthStatus;
}

export const drones: Drone[] = [
  { id: "drn-01", name: "Falcon-1", model: "PX4 X500", battery: 92, status: "online", lastSeen: "2s ago" },
  { id: "drn-02", name: "Falcon-2", model: "PX4 X500", battery: 47, status: "degraded", lastSeen: "5s ago" },
  { id: "drn-03", name: "Heron-1", model: "ArduPilot Quad", battery: 0, status: "offline", lastSeen: "12m ago" },
  { id: "drn-04", name: "Heron-2", model: "ArduPilot Quad", battery: 78, status: "online", lastSeen: "1s ago" },
];

export const stations: Station[] = [
  { id: "stn-01", name: "Central Hub", location: "Soongsil Univ. Rooftop", capacity: 8, inUse: 3, status: "online" },
  { id: "stn-02", name: "North Sink", location: "Block B Landing Pad", capacity: 4, inUse: 4, status: "degraded" },
  { id: "stn-03", name: "East Relay", location: "Library Annex", capacity: 6, inUse: 0, status: "offline" },
];

export const tags: Tag[] = [
  { id: "tag-01", parcelId: "AP-7F3K2", uid: "04:A2:2C:1B", assignedTo: "Falcon-1", status: "online" },
  { id: "tag-02", parcelId: "AP-9Q1M8", uid: "04:B7:90:33", assignedTo: "Heron-2", status: "online" },
  { id: "tag-03", parcelId: "AP-3X8L5", uid: "04:C1:44:0E", assignedTo: "unassigned", status: "offline" },
];

export interface TimelineEvent {
  label: string;
  timestamp: string;
  state: "done" | "active" | "pending";
}

export const deliveryTimeline: TimelineEvent[] = [
  { label: "Parcel registered", timestamp: "10:02", state: "done" },
  { label: "Tag assigned & loaded at Central Hub", timestamp: "10:14", state: "done" },
  { label: "Drone Falcon-1 departed", timestamp: "10:21", state: "done" },
  { label: "In flight — en route to destination", timestamp: "10:21", state: "active" },
  { label: "Arrival & winch drop", timestamp: "—", state: "pending" },
  { label: "Delivered", timestamp: "—", state: "pending" },
];
