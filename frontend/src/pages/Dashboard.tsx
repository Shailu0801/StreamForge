import { useEffect, useState } from "react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import MetricCard from "../components/dashboard/MetricCard";
import WorkerStatus from "../components/dashboard/WorkerStatus";
import KafkaHealth from "../components/dashboard/KafkaHealth";
import EventChart from "../components/charts/EventChart";
import StreamTopology from "../components/topology/StreamTopology";

import {
  getMetrics,
  getBackendStatus,
} from "../api/backend";

import type {
  Metrics,
  BackendStatus,
} from "../api/backend";

const Dashboard = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [backendStatus, setBackendStatus] =
    useState<BackendStatus | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await getMetrics();

        setMetrics(data);
        setError("");
      } catch (err) {
        console.error("Metrics error:", err);
        setError("Unable to connect to backend");
      }
    };

    const loadBackendStatus = async () => {
      try {
        const data = await getBackendStatus();

        setBackendStatus(data);
      } catch (err) {
        console.error("Backend status error:", err);
      }
    };

    // Load immediately
    loadMetrics();
    loadBackendStatus();

    // Refresh every 5 seconds
    const metricsInterval = setInterval(
      loadMetrics,
      5000
    );

    const statusInterval = setInterval(
      loadBackendStatus,
      5000
    );

    // Cleanup
    return () => {
      clearInterval(metricsInterval);
      clearInterval(statusInterval);
    };
  }, []);

  const dashboardMetrics = [
    {
      title: "Total Events",
      value: metrics?.total_events ?? 0,
      status: metrics ? "Live" : "Loading...",
      icon: undefined,
    },
    {
      title: "Average Temperature",
      value: metrics?.average_temperature ?? 0,
      suffix: "°C",
      status: metrics ? "Live" : "Loading...",
      icon: undefined,
    },
    {
      title: "Average Speed",
      value: metrics?.average_speed ?? 0,
      suffix: " km/h",
      status: metrics ? "Live" : "Loading...",
      icon: undefined,
    },
    {
      title: "Average Fuel",
      value: metrics?.average_fuel ?? 0,
      suffix: "%",
      status: metrics ? "Live" : "Loading...",
      icon: undefined,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-8 py-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <DashboardHeader />

        {/* Backend Status */}
        {backendStatus && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              System Status
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

              <div>
                <p className="text-sm text-slate-400">
                  Backend
                </p>

                <p className="mt-1 font-semibold text-green-400">
                  🟢 {backendStatus.backend}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Database
                </p>

                <p className="mt-1 font-semibold text-green-400">
                  🟢 {backendStatus.database}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Kafka
                </p>

                <p className="mt-1 font-semibold text-green-400">
                  🟢 {backendStatus.kafka}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Consumer
                </p>

                <p
                  className={`mt-1 font-semibold ${
                    backendStatus.consumer === "Running"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {backendStatus.consumer === "Running"
                    ? "🟢"
                    : "🟡"}{" "}
                  {backendStatus.consumer}
                </p>
              </div>

            </div>
          </section>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <MetricCard
  key={metric.title}
  metric={metric}
/>          ))}
        </section>

        {/* Event Processing Chart */}
        <section>
          <EventChart />
        </section>

        {/* Worker Status & Kafka Health */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <WorkerStatus />
          <KafkaHealth />
        </section>

        {/* Stream Topology */}
        <section>
          <StreamTopology />
        </section>

      </div>
    </main>
  );
};

export default Dashboard;