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
- **react-router-dom** for routing
- **lucide-react** icons

All data is currently mocked (`src/data/mock.ts`). No backend wiring yet.

## Run

```bash
npm install
npm run build      # type-checks + production build to dist/
npm run dev        # local dev server
npm run preview    # serve the built bundle
```

## Screens

- `/admin` — Admin dashboard: stat cards, drone/station/tag CRUD tables, health badges.
- `/register` — User flow: register-parcel form that issues a tracking number.
- `/track/:trackingNumber` — Live map tracking placeholder + delivery status timeline.

## Next (not done here)

- Swap `MapPlaceholder` for a real map (Leaflet/MapLibre).
- Wire CRUD + tracking to the backend API.
- Real-time updates over the health-check WebSocket.
- Embedded Kibana panels in the admin view.
