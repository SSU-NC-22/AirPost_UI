# AirPost UI — the web front end

This repository is the **web application** for [AirPost](https://github.com/jsoone24/NC_AirPost), the
autonomous drone parcel-delivery system. It is the only part a human touches directly; everything
else (the Go backend, the drones, the telemetry pipeline) sits behind it.

## What the app does

- **Operators / admins** — manage the fleet: add/remove drones, stations and AprilTag tags, watch
  each device's live health, and view telemetry dashboards.
- **Senders** — register a parcel (choose a source station + destination), get a **tracking number**,
  and watch the drone fly the parcel **live on a map**.

## Where it sits in the system

```
AirPost UI ──REST──────────►  application  :8081   (login, manage devices, register a delivery)
           └─WebSocket───────►  health-check :8085   (live drone positions → the tracking map)
```

It is a thin client: all routing, dispatch and storage happen in the
[backend](https://github.com/SSU-NC-22/AirPost_Backend); the UI just calls its REST API and
subscribes to the health-check WebSocket for real-time updates.

## Two apps in this repo

| Folder | What it is | Status |
|---|---|---|
| **[`ui-next/`](./ui-next)** | The **current** app: Vite + React 18 + TypeScript, Tailwind, shadcn/ui, and a **Leaflet + OpenStreetMap** live tracking map. Wired to the real backend (REST + WebSocket). | ✅ shipped in the `docker compose` stack (served on http://localhost:4173) |
| `ui/` | The legacy Create-React-App version. | superseded by `ui-next` |

See **[`ui-next/README.md`](./ui-next/README.md)** for the stack, the backend endpoints it calls,
the screens, and how to run/build it.

## Quick start (ui-next)

```bash
cd ui-next
npm install
npm run dev        # local dev server
npm run build      # type-check + production bundle to dist/
```

Point it at a backend with `VITE_API_BASE` (default `http://localhost:8081`) and `VITE_WS_BASE`
(default `ws://localhost:8085`). The easiest way to get a backend up is the umbrella repo's
`docker compose` stack — see the [top-level README](https://github.com/jsoone24/NC_AirPost).
