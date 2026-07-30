import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

import Card from "../common/Card";

const nodes = [
  {
    id: "1",
    position: { x: 0, y: 80 },
    data: { label: "Kafka Cluster" },
    style: {
      background: "#2563EB",
      color: "#fff",
      borderRadius: "12px",
      padding: "10px",
      border: "none",
    },
  },

  {
    id: "2",
    position: { x: 220, y: 80 },
    data: { label: "Topic Partitions" },
    style: {
      background: "#1E293B",
      color: "#fff",
      borderRadius: "12px",
    },
  },

  {
    id: "3",
    position: { x: 470, y: 80 },
    data: { label: "Python Workers" },
    style: {
      background: "#1E293B",
      color: "#fff",
      borderRadius: "12px",
    },
  },

  {
    id: "4",
    position: { x: 730, y: 80 },
    data: { label: "Window Aggregation" },
    style: {
      background: "#1E293B",
      color: "#fff",
      borderRadius: "12px",
    },
  },

  {
    id: "5",
    position: { x: 1010, y: 80 },
    data: { label: "RocksDB State" },
    style: {
      background: "#1E293B",
      color: "#fff",
      borderRadius: "12px",
    },
  },

  {
    id: "6",
    position: { x: 1260, y: 80 },
    data: { label: "FastAPI API" },
    style: {
      background: "#1E293B",
      color: "#fff",
      borderRadius: "12px",
    },
  },

  {
    id: "7",
    position: { x: 1510, y: 80 },
    data: { label: "Dashboard" },
    style: {
      background: "#22C55E",
      color: "#fff",
      borderRadius: "12px",
      border: "none",
    },
  },
];

const edges = [
  { id: "e1", source: "1", target: "2", animated: true },
  { id: "e2", source: "2", target: "3", animated: true },
  { id: "e3", source: "3", target: "4", animated: true },
  { id: "e4", source: "4", target: "5", animated: true },
  { id: "e5", source: "5", target: "6", animated: true },
  { id: "e6", source: "6", target: "7", animated: true },
];

const StreamTopology = () => {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-white mb-6">
        🌐 Stream Processing Topology
      </h2>

      <div className="h-[450px] rounded-xl overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </Card>
  );
};

export default StreamTopology;