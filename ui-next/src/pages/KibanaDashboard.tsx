import { ExternalLink } from "lucide-react";

// Kibana runs as a separate service (see docker-elasticsearch-kibana + the
// airpost-sensor-dashboard.ndjson dashboard). We embed it rather than reimplement
// its visualizations. Point VITE_KIBANA_URL at the dashboard's share/embed URL.
const KIBANA_URL =
  import.meta.env.VITE_KIBANA_URL ?? "http://localhost:5601/app/dashboards";

export function KibanaDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sensor Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Live Kibana visualizations of node sensor streams (Elasticsearch).
          </p>
        </div>
        <a
          href={KIBANA_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          Open in Kibana <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <iframe
        title="Kibana — AirPost Sensor Streams"
        src={KIBANA_URL}
        className="h-[calc(100vh-12rem)] w-full rounded-lg border"
      />
    </div>
  );
}
