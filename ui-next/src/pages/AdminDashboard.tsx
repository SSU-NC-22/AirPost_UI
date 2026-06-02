import { useEffect, useState } from "react";
import { Plane, Building2, Tag as TagIcon, Activity } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { CrudTable, type Column } from "@/components/admin/CrudTable";
import { HealthBadge } from "@/components/HealthBadge";
import { listNodes, type NodeGroups } from "@/lib/api";
import type { Drone, Station, Tag } from "@/data/mock";

const droneCols: Column<Drone>[] = [
  { key: "name", header: "Name" },
  { key: "model", header: "Model" },
  { key: "battery", header: "Battery", render: (d) => `${d.battery}%` },
  { key: "status", header: "Health", render: (d) => <HealthBadge status={d.status} /> },
  { key: "lastSeen", header: "Last Seen" },
  { key: "actions", header: "" },
];

const stationCols: Column<Station>[] = [
  { key: "name", header: "Name" },
  { key: "location", header: "Location" },
  { key: "capacity", header: "Capacity", render: (s) => `${s.inUse}/${s.capacity}` },
  { key: "status", header: "Health", render: (s) => <HealthBadge status={s.status} /> },
  { key: "actions", header: "" },
];

const tagCols: Column<Tag>[] = [
  { key: "parcelId", header: "Parcel ID" },
  { key: "uid", header: "Tag UID" },
  { key: "assignedTo", header: "Assigned To" },
  { key: "status", header: "Health", render: (t) => <HealthBadge status={t.status} /> },
  { key: "actions", header: "" },
];

const EMPTY: NodeGroups = { drones: [], stations: [], tags: [] };

export function AdminDashboard() {
  const [nodes, setNodes] = useState<NodeGroups>(EMPTY);

  useEffect(() => {
    listNodes().then(setNodes).catch(() => setNodes(EMPTY));
  }, []);

  const { drones, stations, tags } = nodes;
  const online = drones.filter((d) => d.status === "online").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Node management and live health-check status.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Plane} label="Drones" value={drones.length} hint={`${online} online`} />
        <StatCard icon={Building2} label="Stations" value={stations.length} hint="nodes" />
        <StatCard icon={TagIcon} label="Tags" value={tags.length} hint="nodes" />
        <StatCard icon={Activity} label="Fleet Health" value={`${drones.length ? Math.round((online / drones.length) * 100) : 0}%`} hint="online ratio" />
      </div>

      <CrudTable title="Drones" addLabel="Add Drone" columns={droneCols} rows={drones} />
      <CrudTable title="Stations" addLabel="Add Station" columns={stationCols} rows={stations} />
      <CrudTable title="Tags" addLabel="Add Tag" columns={tagCols} rows={tags} />
    </div>
  );
}
