# ui-next — Vite + React frontend. Build the static bundle, then serve it with
# `vite preview` (a tiny static server). Vite inlines VITE_* env at BUILD time,
# so the API/WS URLs are passed as build args, not runtime env.
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first so source edits don't bust the npm cache layer.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build-time config: where the browser reaches the backend. These are baked
# into the bundle, so they must be the URLs the *browser* uses (host ports),
# not in-network service names.
ARG VITE_API_BASE=http://localhost:8081
ARG VITE_WS_BASE=ws://localhost:8085
ARG VITE_USE_MOCK=false
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_WS_BASE=$VITE_WS_BASE
ENV VITE_USE_MOCK=$VITE_USE_MOCK
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Only the build output and vite (the preview server) are needed at runtime.
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/vite.config.ts ./vite.config.ts
EXPOSE 4173
# --host 0.0.0.0 so the preview server is reachable from outside the container.
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
