# AirPost UI — the web app (ui-next)

This is the **web front end** of the [AirPost](https://github.com/jsoone24/NC_AirPost) drone-delivery
system — the only part a normal user or operator ever touches directly. Everything else (servers,
drones, data pipeline) sits behind it.

## What it does

The UI serves two kinds of people:

- **Operators / admins** — manage the fleet: add or remove drones, stations and AprilTag tags, see
  each device's live health, and view telemetry dashboards.
- **Senders** — register a parcel (pick a source station and a destination), get a **tracking
  number**, and then watch the drone fly their parcel **live on a map**.

## Where it sits in AirPost

```
AirPost UI (this app)
  ├─ REST  ───────────────►  application :8081   (register parcels, manage devices)
  └─ WebSocket ───────────►  health-check :8085  (live drone positions → the tracking map)
```

It is a thin, fast client: all the decisions, routing and storage happen in the
[backend](https://github.com/SSU-NC-22/AirPost_Backend); the UI calls its REST API and subscribes to
the health-check WebSocket for real-time updates.

> This is the modern **ui-next** app (Vite + React + TypeScript), which supersedes the legacy `../ui`
> (old CRA app). It is the version shipped in the `docker compose` stack (served on
> http://localhost:4173).

---


## Stack

- **Vite 6** + **React 18** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **shadcn/ui**-style components (`src/components/ui`)
- **react-router-dom** for routing, **lucide-react** icons
- **Leaflet** + **react-leaflet** for the live map (OpenStreetMap tiles — open-source, no API key)

## Backend wiring (live, not mocked)

The app talks to the real backend:

- **REST** to `application` (`VITE_API_BASE`, default `http://localhost:8081`): `/auth/login`,
  `GET /regist/node`, `POST /regist/delivery`, `GET /regist/tracking/:orderNum`, CRUD on devices.
- **WebSocket** to `health-check` (`VITE_WS_BASE`, default `ws://localhost:8085/health-check`):
  live drone coordinates feed the tracking map in real time (`src/lib/useDroneCoords.ts`).

`src/data/mock.ts` is only a **fallback** so the UI still renders when the backend is unreachable
(or when `VITE_USE_MOCK=true`); it is not the normal data source.

## Run

```bash
npm install
npm run build      # type-checks + production build to dist/
npm run dev        # local dev server
npm run preview    # serve the built bundle
```

Configure the backend endpoints via `VITE_API_BASE` / `VITE_WS_BASE` (see `.env` / Vite env).

## Screens

- `/admin` — Admin dashboard: stat cards, drone/station/tag CRUD tables, live health badges.
- `/register` — register-parcel form that issues a tracking number.
- `/track/:trackingNumber` — **live Leaflet/OpenStreetMap tracking** (source, destination and the
  drone's live position + path) plus the delivery status timeline.

## Possible next steps

- Embedded Kibana panels in the admin view.
- Map polish: drone heading/trail, ETA, clustering for many drones.
- Customer notifications (push/SMS) and proof-of-delivery.
