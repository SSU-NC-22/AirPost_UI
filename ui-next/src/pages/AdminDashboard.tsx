import { useCallback, useEffect, useState } from "react";
import { Plane, Building2, Tag as TagIcon, Activity } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { CrudTable, type Column } from "@/components/admin/CrudTable";
import { HealthBadge } from "@/components/HealthBadge";
import {
  listNodes,
  listSinks,
  listTopics,
  registSink,
  registTopic,
  unregistSink,
  unregistTopic,
  unregistNode,
  type NodeGroups,
  type ApiSink,
  type ApiTopic,
} from "@/lib/api";
import type { Drone, Station, Tag } from "@/data/mock";

// Display id is "<prefix>-<nodeId>" (see api.ts groupNodes); recover the numeric node id.
const nodeId = (displayId: string): number => Number(displayId.split("-")[1]);

const sinkCols: Column<ApiSink>[] = [
  { key: "name", header: "Name" },
  { key: "addr", header: "Address" },
  { key: "topic_id", header: "Topic ID" },
  { key: "actions", header: "" },
];

const topicCols: Column<ApiTopic>[] = [
  { key: "name", header: "Name" },
  { key: "partitions", header: "Partitions" },
  { key: "replications", header: "Replications" },
  { key: "actions", header: "" },
];

const EMPTY: NodeGroups = { drones: [], stations: [], tags: [] };

export function AdminDashboard() {
  const [nodes, setNodes] = useState<NodeGroups>(EMPTY);
  const [sinks, setSinks] = useState<ApiSink[]>([]);
  const [topics, setTopics] = useState<ApiTopic[]>([]);

  const refresh = useCallback(() => {
    listNodes().then(setNodes).catch(() => setNodes(EMPTY));
    listSinks().then(setSinks).catch(() => setSinks([]));
    listTopics().then(setTopics).catch(() => setTopics([]));
  }, []);

  useEffect(refresh, [refresh]);

  // Wrap a mutation so any failure surfaces to the user and the tables re-sync.
  const run = useCallback(
    (action: Promise<void>) => {
      action.then(refresh).catch((e) => alert(`Request failed: ${e.message ?? e}`));
    },
    [refresh]
  );

  const addSink = () => {
    const name = prompt("Sink name?");
    if (!name) return;
    const addr = prompt("Sink address (host:port)?") ?? "";
    const topic_id = Number(prompt("Topic ID?") ?? "0");
    run(registSink({ name, addr, topic_id }));
  };

  const addTopic = () => {
    const name = prompt("Topic name?");
    if (!name) return;
    const partitions = Number(prompt("Partitions?", "1") ?? "1");
    const replications = Number(prompt("Replications?", "1") ?? "1");
    run(registTopic({ name, partitions, replications }));
  };

  const delNode = (row: { id: string }) => {
    if (confirm(`Delete node ${row.id}?`)) run(unregistNode(nodeId(row.id)));
  };

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

  const { drones, stations, tags } = nodes;
  const online = drones.filter((d) => d.status === "online").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Nodes, sinks, and Kafka topics, plus live health-check status.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Plane} label="Drones" value={drones.length} hint={`${online} online`} />
        <StatCard icon={Building2} label="Stations" value={stations.length} hint="nodes" />
        <StatCard icon={TagIcon} label="Tags" value={tags.length} hint="nodes" />
        <StatCard
          icon={Activity}
          label="Fleet Health"
          value={`${drones.length ? Math.round((online / drones.length) * 100) : 0}%`}
          hint="online ratio"
        />
      </div>

      <CrudTable title="Drones" addLabel="Add Drone" columns={droneCols} rows={drones} onDelete={delNode} />
      <CrudTable title="Stations" addLabel="Add Station" columns={stationCols} rows={stations} onDelete={delNode} />
      <CrudTable title="Tags" addLabel="Add Tag" columns={tagCols} rows={tags} onDelete={delNode} />
      <CrudTable
        title="Sinks"
        addLabel="Add Sink"
        columns={sinkCols}
        rows={sinks}
        onAdd={addSink}
        onDelete={(s) => confirm(`Delete sink ${s.name}?`) && run(unregistSink(s.id))}
      />
      <CrudTable
        title="Kafka Topics"
        addLabel="Add Topic"
        columns={topicCols}
        rows={topics}
        onAdd={addTopic}
        onDelete={(t) => confirm(`Delete topic ${t.name}?`) && run(unregistTopic(t.id))}
      />
    </div>
  );
}
