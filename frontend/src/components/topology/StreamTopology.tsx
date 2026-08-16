import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";

import Card from "../common/Card";

interface PrometheusMetrics {
  status: string;
  events_processed: number;
  events_per_second: number;
  processing_lag: number;
  processing_errors: number;
  consumer_running: number;
}

const API_URL = "http://127.0.0.1:8000/prometheus";

const StreamTopology = () => {
  const [metrics, setMetrics] = useState<PrometheusMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadMetrics = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load Prometheus metrics");
      }

      const data: PrometheusMetrics = await response.json();

      setMetrics(data);
      setError(false);
    } catch (err) {
      console.error("Prometheus metrics error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();

    const interval = setInterval(loadMetrics, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const isBottleneck =
    metrics !== null &&
    (metrics.processing_lag > 10 ||
      metrics.processing_errors > 0);

  const workerStatus = useMemo(() => {
    if (loading) {
      return "Loading...";
    }

    if (error) {
      return "Metrics Offline";
    }

    if (!metrics) {
      return "Waiting...";
    }

    if (metrics.consumer_running !== 1) {
      return "Worker Stopped";
    }

    if (isBottleneck) {
      return "⚠ BOTTLENECK";
    }

    return "● Healthy";
  }, [loading, error, metrics, isBottleneck]);

  const nodes: Node[] = [
    {
      id: "1",
      position: { x: 0, y: 120 },
      data: {
        label: "Kafka Cluster",
      },
      style: {
        background: "#2563EB",
        color: "#fff",
        borderRadius: "12px",
        padding: "12px",
        border: "none",
        minWidth: 150,
        textAlign: "center",
      },
    },

    {
      id: "2",
      position: { x: 220, y: 120 },
      data: {
        label: "Topic Partitions",
      },
      style: {
        background: "#1E293B",
        color: "#fff",
        borderRadius: "12px",
        padding: "12px",
        minWidth: 150,
        textAlign: "center",
      },
    },

    {
      id: "3",
      position: { x: 440, y: 70 },
      data: {
        label: (
          <div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              Python Workers
            </div>

            <div
              style={{
                marginTop: "10px",
                fontSize: "12px",
                lineHeight: "1.6",
                textAlign: "left",
              }}
            >
              <div>
                Events:{" "}
                <strong>
                  {metrics?.events_processed ?? 0}
                </strong>
              </div>

              <div>
                Events/sec:{" "}
                <strong>
                  {metrics
                    ? metrics.events_per_second.toFixed(2)
                    : "0.00"}
                </strong>
              </div>

              <div>
                Lag:{" "}
                <strong
                  style={{
                    color:
                      (metrics?.processing_lag ?? 0) > 10
                        ? "#F87171"
                        : "#4ADE80",
                  }}
                >
                  {metrics?.processing_lag ?? 0}
                </strong>
              </div>

              <div>
                Errors:{" "}
                <strong
                  style={{
                    color:
                      (metrics?.processing_errors ?? 0) > 0
                        ? "#F87171"
                        : "#4ADE80",
                  }}
                >
                  {metrics?.processing_errors ?? 0}
                </strong>
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontWeight: "bold",
                  color: isBottleneck
                    ? "#F87171"
                    : "#4ADE80",
                }}
              >
                {workerStatus}
              </div>
            </div>
          </div>
        ),
      },
      style: {
        background: isBottleneck
          ? "#7F1D1D"
          : "#1E293B",
        color: "#fff",
        borderRadius: "12px",
        padding: "14px",
        minWidth: 190,
        border: isBottleneck
          ? "3px solid #EF4444"
          : "2px solid #22C55E",
        boxShadow: isBottleneck
          ? "0 0 20px rgba(239, 68, 68, 0.5)"
          : "0 0 15px rgba(34, 197, 94, 0.2)",
      },
    },

    {
      id: "4",
      position: { x: 720, y: 120 },
      data: {
        label: "Window Aggregation",
      },
      style: {
        background: "#1E293B",
        color: "#fff",
        borderRadius: "12px",
        padding: "12px",
        minWidth: 160,
        textAlign: "center",
      },
    },

    {
      id: "5",
      position: { x: 960, y: 120 },
      data: {
        label: "RocksDB State",
      },
      style: {
        background: "#1E293B",
        color: "#fff",
        borderRadius: "12px",
        padding: "12px",
        minWidth: 150,
        textAlign: "center",
      },
    },

    {
      id: "6",
      position: { x: 1190, y: 120 },
      data: {
        label: "FastAPI API",
      },
      style: {
        background: "#1E293B",
        color: "#fff",
        borderRadius: "12px",
        padding: "12px",
        minWidth: 150,
        textAlign: "center",
      },
    },

    {
      id: "7",
      position: { x: 1420, y: 120 },
      data: {
        label: (
          <div>
            <div>Dashboard</div>

            <div
              style={{
                marginTop: "6px",
                fontSize: "12px",
              }}
            >
              {metrics?.consumer_running === 1
                ? "● Live"
                : "● Offline"}
            </div>
          </div>
        ),
      },
      style: {
        background: "#22C55E",
        color: "#fff",
        borderRadius: "12px",
        padding: "12px",
        minWidth: 150,
        textAlign: "center",
        border: "none",
      },
    },
  ];

  const edges: Edge[] = [
    {
      id: "e1",
      source: "1",
      target: "2",
      animated: true,
    },
    {
      id: "e2",
      source: "2",
      target: "3",
      animated: true,
    },
    {
      id: "e3",
      source: "3",
      target: "4",
      animated: true,
    },
    {
      id: "e4",
      source: "4",
      target: "5",
      animated: true,
    },
    {
      id: "e5",
      source: "5",
      target: "6",
      animated: true,
    },
    {
      id: "e6",
      source: "6",
      target: "7",
      animated: true,
    },
  ];

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 className="text-xl font-semibold text-white">
            Stream Processing DAG
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Live Prometheus monitoring
          </p>
        </div>

        <div>
          {error ? (
            <span className="text-red-400 text-sm">
              ● Metrics Offline
            </span>
          ) : (
            <span className="text-green-400 text-sm">
              ● Metrics Connected
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <p className="text-xs text-slate-400">
            Events Processed
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {metrics?.events_processed ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <p className="text-xs text-slate-400">
            Events / Second
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {metrics
              ? metrics.events_per_second.toFixed(2)
              : "0.00"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <p className="text-xs text-slate-400">
            Processing Lag
          </p>

          <p
            className={`mt-1 text-xl font-bold ${
              (metrics?.processing_lag ?? 0) > 10
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {metrics?.processing_lag ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <p className="text-xs text-slate-400">
            Processing Errors
          </p>

          <p
            className={`mt-1 text-xl font-bold ${
              (metrics?.processing_errors ?? 0) > 0
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {metrics?.processing_errors ?? 0}
          </p>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "450px",
          background: "#020617",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #1E293B",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{
            padding: 0.2,
          }}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background />
          <Controls />

          <MiniMap
            nodeColor={(node) => {
              if (node.id === "1") {
                return "#2563EB";
              }

              if (node.id === "3") {
                return isBottleneck
                  ? "#EF4444"
                  : "#22C55E";
              }

              if (node.id === "7") {
                return "#22C55E";
              }

              return "#475569";
            }}
          />
        </ReactFlow>
      </div>

      <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500" />
          Healthy
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          Bottleneck
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-500" />
          Kafka
        </div>
      </div>

      {isBottleneck && (
        <div className="mt-4 rounded-xl border border-red-500/40 bg-red-950/40 p-4">
          <p className="font-semibold text-red-400">
            ⚠ Bottleneck detected
          </p>

          <p className="mt-1 text-sm text-red-300">
            Python Workers are currently showing high
            processing lag or processing errors.
          </p>
        </div>
      )}
    </Card>
  );
};

export default StreamTopology;