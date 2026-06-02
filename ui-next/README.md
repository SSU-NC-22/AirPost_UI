# AirPost UI (ui-next)

Modern frontend scaffold for AirPost — **Phase 4** of the ROADMAP. This lives
alongside the legacy `../ui` (old CRA app) and does **not** replace it yet.

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
