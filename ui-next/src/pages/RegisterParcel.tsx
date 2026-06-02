import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listNodes, registerParcel, type NodeGroups } from "@/lib/api";

// Source stations and destination tags are referenced by numeric id, so the
// form loads them from the API to populate the pickers.
function idFromKey(key: string): number {
  return Number(key.split("-")[1]);
}

export function RegisterParcel() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<NodeGroups | null>(null);
  const [tracking, setTracking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listNodes().then(setNodes).catch(() => setNodes(null));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const orderNum = await registerParcel({
        email: String(form.get("email")),
        src_name: String(form.get("srcName")),
        src_phone: String(form.get("srcPhone")),
        src_station_id: idFromKey(String(form.get("srcStation"))),
        dest_name: String(form.get("destName")),
        dest_phone: String(form.get("destPhone")),
        dest_tag_id: idFromKey(String(form.get("destTag"))),
      });
      setTracking(orderNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register parcel");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Register a Parcel</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details to issue a tracking number.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5" /> Parcel Details
          </CardTitle>
          <CardDescription>Submits to the AirPost delivery service.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Notification email</Label>
              <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="srcName">Sender name</Label>
                <Input id="srcName" name="srcName" required placeholder="Jane Doe" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="srcPhone">Sender contact</Label>
                <Input id="srcPhone" name="srcPhone" required placeholder="010-0000-0000" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="srcStation">Source station</Label>
              <select
                id="srcStation"
                name="srcStation"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                {(nodes?.stations ?? []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="destName">Recipient name</Label>
                <Input id="destName" name="destName" required placeholder="John Roe" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="destPhone">Recipient contact</Label>
                <Input id="destPhone" name="destPhone" required placeholder="010-1111-1111" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="destTag">Destination tag</Label>
              <select
                id="destTag"
                name="destTag"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                {(nodes?.tags ?? []).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.parcelId}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Registering…" : "Register & issue tracking number"}
            </Button>
          </form>

          {error && (
            <p className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}

          {tracking && (
            <div className="mt-6 rounded-lg border bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Your tracking number</p>
              <p className="my-1 font-mono text-2xl font-semibold tracking-wider">{tracking}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => navigate(`/track/${tracking}`)}
              >
                Track this parcel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
