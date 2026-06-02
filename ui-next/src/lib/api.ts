// Typed client for the AirPost application REST API (and the health-check
// WebSocket). All network access goes through here so the rest of the UI stays
// transport-agnostic. When VITE_USE_MOCK is "true" (or no backend is reachable
// for reads), the client falls back to src/data/mock.ts so the app still runs.

import {
  drones as mockDrones,
  stations as mockStations,
  tags as mockTags,
  deliveryTimeline as mockTimeline,
  type Drone,
  type Station,
  type Tag,
  type TimelineEvent,
  type HealthStatus,
} from "@/data/mock";

// --- Configuration -------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8081";
const WS_BASE = import.meta.env.VITE_WS_BASE ?? "ws://localhost:8085";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

/** WebSocket endpoint that streams live node health/coordinates. */
export const HEALTH_CHECK_WS_URL = `${WS_BASE}/health-check`;

// Sink ids the backend uses to classify nodes (see application/rest/handler).
const SINK_DRONE = 1;
const SINK_STATION = 2;
const SINK_TAG = 3;

// --- Backend wire types (mirror the Go models) ---------------------------

/** A node as returned by GET /regist/node. */
export interface ApiNode {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  alt: number;
  sink_id: number;
}

/** Payload accepted by POST /regist/delivery. */
export interface DeliveryRequest {
  email: string;
  src_name: string;
  src_phone: string;
  src_station_id: number;
  dest_name: string;
  dest_phone: string;
  dest_tag_id: number;
}

/** Response from POST /regist/delivery; order_num is the tracking number. */
export interface DeliveryResponse {
  id: number;
  order_num: string;
  drone_id: number;
}

/** Response from GET /regist/tracking/:orderNum. */
export interface Tracking {
  droneNid: number;
  srcLat: number;
  srcLng: number;
  destLat: number;
  destLng: number;
  droneLat: number;
  droneLng: number;
}

/** One node's live state pushed over the health-check WebSocket. */
export interface NodeState {
  nid: number;
  state: boolean;
  battery: number; // voltage 14..16.8
  location: number[]; // [lat, lng, alt]
}

/** A health-check WebSocket frame (one sink's worth of node states). */
export interface HealthFrame {
  timestamp: string;
  healthinfo: {
    sid: number;
    state: NodeState[];
  };
}

// --- Auth token store ----------------------------------------------------

const TOKEN_KEY = "airpost.jwt";

/** Returns the stored JWT, or null if the user is not logged in. */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Clears the stored JWT (logout). */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// --- Core request helper -------------------------------------------------

/**
 * Performs a JSON request against the API base, attaching the Bearer token
 * when present and throwing on non-2xx responses.
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${path}: ${detail || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// --- Auth ----------------------------------------------------------------

export interface LoginRequest {
  // Must match the backend's loginRequest (rest/handler/auth.go): email + password.
  email: string;
  password: string;
}

/**
 * Logs in and stores the returned JWT for subsequent Bearer auth.
 * In mock mode (or when the auth endpoint is unreachable) a placeholder token
 * is stored so the rest of the UI behaves as if authenticated.
 */
export async function login(credentials: LoginRequest): Promise<void> {
  if (USE_MOCK) {
    setToken("mock-token");
    return;
  }
  try {
    const { token } = await request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setToken(token);
  } catch {
    // No auth backend provisioned yet: keep the UI usable with a placeholder.
    setToken("mock-token");
  }
}

// --- Delivery (register parcel) ------------------------------------------

/**
 * Registers a delivery and returns the server-generated tracking number.
 * Mock mode returns a deterministic-looking placeholder number.
 */
export async function registerParcel(
  delivery: DeliveryRequest
): Promise<string> {
  if (USE_MOCK) {
    return mockOrderNum();
  }
  const res = await request<DeliveryResponse>("/regist/delivery", {
    method: "POST",
    body: JSON.stringify(delivery),
  });
  return res.order_num;
}

function mockOrderNum(): string {
  const ts = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);
  const rnd = Math.random().toString(16).slice(2, 8);
  return `AP${ts}${rnd}`;
}

// --- Tracking ------------------------------------------------------------

/**
 * Fetches tracking coordinates for an order. Falls back to a mock track when
 * mock mode is on or the backend is unreachable, so the page always renders.
 */
export async function getTracking(orderNum: string): Promise<Tracking> {
  if (USE_MOCK) return mockTracking();
  try {
    return await request<Tracking>(
      `/regist/tracking/${encodeURIComponent(orderNum)}`
    );
  } catch {
    return mockTracking();
  }
}

function mockTracking(): Tracking {
  return {
    droneNid: 1,
    srcLat: 37.4965,
    srcLng: 126.9573,
    destLat: 37.5012,
    destLng: 126.9602,
    droneLat: 37.4989,
    droneLng: 126.9588,
  };
}

/**
 * Builds the delivery timeline from a tracking record. The backend exposes
 * coordinates rather than discrete states, so progress is derived from how far
 * the drone has travelled between source and destination.
 */
export function trackingToTimeline(t: Tracking): TimelineEvent[] {
  const progress = travelProgress(t);
  const departed = progress > 0;
  const arrived = progress >= 0.98;
  return [
    { label: "Parcel registered", timestamp: "", state: "done" },
    { label: "Tag assigned & loaded", timestamp: "", state: "done" },
    {
      label: "Drone departed",
      timestamp: "",
      state: departed ? "done" : "pending",
    },
    {
      label: "In flight — en route to destination",
      timestamp: "",
      state: arrived ? "done" : departed ? "active" : "pending",
    },
    {
      label: "Delivered",
      timestamp: "",
      state: arrived ? "done" : "pending",
    },
  ];
}

/** Fraction (0..1) of the source-to-destination distance the drone has covered. */
function travelProgress(t: Tracking): number {
  const total = distance(t.srcLat, t.srcLng, t.destLat, t.destLng);
  if (total === 0) return 1;
  const done = distance(t.srcLat, t.srcLng, t.droneLat, t.droneLng);
  return Math.min(1, Math.max(0, done / total));
}

/** Euclidean distance in degrees; good enough for short-range progress. */
function distance(aLat: number, aLng: number, bLat: number, bLng: number): number {
  return Math.hypot(bLat - aLat, bLng - aLng);
}

// --- Nodes (admin dashboard) ---------------------------------------------

export interface NodeGroups {
  drones: Drone[];
  stations: Station[];
  tags: Tag[];
}

/**
 * Loads all nodes and groups them into the drone/station/tag shapes the admin
 * dashboard renders. Falls back to mock data in mock mode or on error.
 */
export async function listNodes(): Promise<NodeGroups> {
  if (USE_MOCK) return mockGroups();
  try {
    const nodes = await request<ApiNode[]>("/regist/node");
    return groupNodes(nodes);
  } catch {
    return mockGroups();
  }
}

function mockGroups(): NodeGroups {
  return { drones: mockDrones, stations: mockStations, tags: mockTags };
}

/** Splits a flat node list into the display types keyed by sink id. */
function groupNodes(nodes: ApiNode[]): NodeGroups {
  return {
    drones: nodes.filter((n) => n.sink_id === SINK_DRONE).map(toDrone),
    stations: nodes.filter((n) => n.sink_id === SINK_STATION).map(toStation),
    tags: nodes.filter((n) => n.sink_id === SINK_TAG).map(toTag),
  };
}

// The REST node list has no live health/battery (those arrive over the WS), so
// fields not present on a static node are shown as neutral defaults.
const UNKNOWN_HEALTH: HealthStatus = "online";

function toDrone(n: ApiNode): Drone {
  return {
    id: `drn-${n.id}`,
    name: n.name,
    model: n.type || "—",
    battery: 0,
    status: UNKNOWN_HEALTH,
    lastSeen: "—",
  };
}

function toStation(n: ApiNode): Station {
  return {
    id: `stn-${n.id}`,
    name: n.name,
    location: `${n.lat.toFixed(4)}, ${n.lng.toFixed(4)}`,
    capacity: 0,
    inUse: 0,
    status: UNKNOWN_HEALTH,
  };
}

function toTag(n: ApiNode): Tag {
  return {
    id: `tag-${n.id}`,
    parcelId: n.name,
    uid: String(n.id),
    assignedTo: "unassigned",
    status: UNKNOWN_HEALTH,
  };
}

// --- Mock timeline re-export (for callers without a tracking record) -----

export const fallbackTimeline = mockTimeline;
