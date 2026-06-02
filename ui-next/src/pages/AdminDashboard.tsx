import { useCallback, useEffect, useState } from "react";
import { Plane, Building2, Tag as TagIcon, Activity } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { CrudTable, type Column } from "@/components/admin/CrudTable";
import { AddEntityDialog, type Field } from "@/components/admin/AddEntityDialog";
import { HealthBadge } from "@/components/HealthBadge";
import {
  listNodes,
  listSinks,
  listTopics,
  registSink,
  registTopic,
  registNode,
  unregistSink,
  unregistTopic,
  unregistNode,
  NODE_KINDS,
  DRONE_SINK_ID,
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

const locFields: Field[] = [
  { name: "lat", label: "Latitude", type: "number", defaultValue: "37.5" },
  { name: "lng", label: "Longitude", type: "number", defaultValue: "127.0" },
  { name: "alt", label: "Altitude (m)", type: "number", defaultValue: "0" },
];

const EMPTY: NodeGroups = { drones: [], stations: [], tags: [] };

interface DialogConfig {
  title: string;
  description?: string;
  fields: Field[];
  onSubmit: (v: Record<string, string>) => Promise<void>;
}

export function AdminDashboard() {
  const [nodes, setNodes] = useState<NodeGroups>(EMPTY);
  const [sinks, setSinks] = useState<ApiSink[]>([]);
  const [topics, setTopics] = useState<ApiTopic[]>([]);
  const [dialog, setDialog] = useState<DialogConfig | null>(null);

  const refresh = useCallback(() => {
    listNodes().then(setNodes).catch(() => setNodes(EMPTY));
    listSinks().then(setSinks).catch(() => setSinks([]));
    listTopics().then(setTopics).catch(() => setTopics([]));
  }, []);

  useEffect(refresh, [refresh]);

  // Delete with a confirm; errors surface and the tables re-sync.
  const del = (action: Promise<void>, label: string) => {
    if (!confirm(`Delete ${label}?`)) return;
    action.then(refresh).catch((e) => alert(`Delete failed: ${e.message ?? e}`));
  };

  // --- "Add" dialogs (the AddEntityDialog awaits onSubmit, shows errors, and closes on success) ---
  const openSink = () =>
    setDialog({
      title: "Add Sink",
      description: "A Kafka consumer that classifies node data (drone/station/tag).",
      fields: [
        { name: "name", label: "Name", placeholder: "drone-sink" },
        { name: "addr", label: "Address (host:port)", placeholder: "0.0.0.0:5000" },
        { name: "topic_id", label: "Topic ID", type: "number", defaultValue: "1" },
      ],
      onSubmit: (v) =>
        registSink({ name: v.name, addr: v.addr, topic_id: Number(v.topic_id) }).then(refresh),
    });

  const openTopic = () =>
    setDialog({
      title: "Add Kafka Topic",
      fields: [
        { name: "name", label: "Name", placeholder: "sensor-data" },
        { name: "partitions", label: "Partitions", type: "number", defaultValue: "1" },
        { name: "replications", label: "Replications", type: "number", defaultValue: "1" },
      ],
      onSubmit: (v) =>
        registTopic({
          name: v.name,
          partitions: Number(v.partitions),
          replications: Number(v.replications),
        }).then(refresh),
    });

  const openNode = (kind: keyof typeof NODE_KINDS, label: string) => () =>
    setDialog({
      title: `Add ${label}`,
      fields: [{ name: "name", label: "Name", placeholder: `${label.toLowerCase()}-1` }, ...locFields],
      onSubmit: (v) =>
        registNode({
          name: v.name,
          type: NODE_KINDS[kind].type,
          lat: Number(v.lat),
          lng: Number(v.lng),
          alt: Number(v.alt),
          sink_id: NODE_KINDS[kind].sink_id,
        }).then(refresh),
    });

  const openDrone = () =>
    setDialog({
      title: "Add Drone",
      description: "A drone is attached to a station (enter that station's id).",
      fields: [
        { name: "name", label: "Name", placeholder: "drone-1" },
        { name: "stationId", label: "Attach to station id", type: "number" },
        ...locFields,
      ],
      onSubmit: (v) =>
        registNode({
          name: v.name,
          type: `DRO-${v.stationId}`,
          lat: Number(v.lat),
          lng: Number(v.lng),
          alt: Number(v.alt),
          sink_id: DRONE_SINK_ID,
        }).then(refresh),
    });

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

      <CrudTable title="Drones" addLabel="Add Drone" columns={droneCols} rows={drones} onAdd={openDrone} onDelete={(d) => del(unregistNode(nodeId(d.id)), `drone ${d.name}`)} />
      <CrudTable title="Stations" addLabel="Add Station" columns={stationCols} rows={stations} onAdd={openNode("station", "Station")} onDelete={(s) => del(unregistNode(nodeId(s.id)), `station ${s.name}`)} />
      <CrudTable title="Tags" addLabel="Add Tag" columns={tagCols} rows={tags} onAdd={openNode("tag", "Tag")} onDelete={(t) => del(unregistNode(nodeId(t.id)), `tag ${t.parcelId}`)} />
      <CrudTable title="Sinks" addLabel="Add Sink" columns={sinkCols} rows={sinks} onAdd={openSink} onDelete={(s) => del(unregistSink(s.id), `sink ${s.name}`)} />
      <CrudTable title="Kafka Topics" addLabel="Add Topic" columns={topicCols} rows={topics} onAdd={openTopic} onDelete={(t) => del(unregistTopic(t.id), `topic ${t.name}`)} />

      {dialog && <AddEntityDialog {...dialog} onClose={() => setDialog(null)} />}
    </div>
  );
}
