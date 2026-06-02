import { Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFleetHealth, batteryPercent } from "@/lib/useFleetHealth";

// Live fleet view: streams the health-check WebSocket and shows every node's real-time
// online/battery/position as telemetry arrives. Empty until the sim/drones publish.
export function FleetStatus() {
  const { nodes, connected } = useFleetHealth();
  const rows = [...nodes.values()].sort((a, b) => a.nid - b.nid);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Live Fleet Telemetry</CardTitle>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Radio className={`h-3.5 w-3.5 ${connected ? "text-emerald-500" : "text-muted-foreground"}`} />
          {connected ? "live" : "waiting for telemetry…"}
        </span>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Node</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Battery</TableHead>
              <TableHead>Position (lat, lng, alt)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((n) => {
              const [lat, lng, alt = 0] = n.location ?? [];
              return (
                <TableRow key={n.nid}>
                  <TableCell>#{n.nid}</TableCell>
                  <TableCell>
                    <Badge variant={n.state ? "default" : "secondary"}>
                      {n.state ? "online" : "offline"}
                    </Badge>
                  </TableCell>
                  <TableCell>{n.battery ? `${batteryPercent(n.battery)}% (${n.battery.toFixed(1)}V)` : "—"}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {lat != null ? `${lat.toFixed(5)}, ${lng.toFixed(5)}, ${alt.toFixed(1)}` : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                  No live telemetry yet — start the sim and register a delivery.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
