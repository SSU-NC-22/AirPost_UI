import { Check, Loader2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/data/mock";

export function DeliveryTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-6 border-l border-border pl-6">
          {events.map((e, i) => (
            <li key={i} className="relative">
              <span
                className={cn(
                  "absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border",
                  e.state === "done" && "border-emerald-500 bg-emerald-500 text-white",
                  e.state === "active" && "border-primary bg-primary text-primary-foreground",
                  e.state === "pending" && "border-border bg-background text-muted-foreground"
                )}
              >
                {e.state === "done" && <Check className="h-3.5 w-3.5" />}
                {e.state === "active" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {e.state === "pending" && <Circle className="h-2 w-2" />}
              </span>
              <div className="flex items-center justify-between gap-4">
                <p
                  className={cn(
                    "text-sm",
                    e.state === "pending" ? "text-muted-foreground" : "font-medium"
                  )}
                >
                  {e.label}
                </p>
                <span className="text-xs text-muted-foreground">{e.timestamp}</span>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
