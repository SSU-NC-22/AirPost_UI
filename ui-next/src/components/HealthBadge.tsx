import { Badge } from "@/components/ui/badge";
import type { HealthStatus } from "@/data/mock";

const map: Record<HealthStatus, { label: string; variant: "success" | "warning" | "destructive" }> = {
  online: { label: "Online", variant: "success" },
  degraded: { label: "Degraded", variant: "warning" },
  offline: { label: "Offline", variant: "destructive" },
};

export function HealthBadge({ status }: { status: HealthStatus }) {
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}
