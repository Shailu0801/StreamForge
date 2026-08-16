import { useEffect, useState } from "react";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";

import WorkerStatus from "./components/dashboard/WorkerStatus";
import KafkaHealth from "./components/dashboard/KafkaHealth";
import StreamTopology from "./components/topology/StreamTopology";
import EventChart from "./components/charts/EventChart";

import { getMetrics } from "./api/backend";
import type { Metrics } from "./api/backend";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Workers":
        return (
          <main className="min-h-screen bg-slate-950 p-8">
            <div className="mx-auto max-w-7xl space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Workers
                </h1>

                <p className="mt-2 text-slate-400">
                  Distributed StreamForge processing workers.
                </p>
              </div>

              <WorkerStatus />
            </div>
          </main>
        );

      case "Kafka":
        return (
          <main className="min-h-screen bg-slate-950 p-8">
            <div className="mx-auto max-w-7xl space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Kafka
                </h1>

                <p className="mt-2 text-slate-400">
                  Kafka brokers, topics and partitions.
                </p>
              </div>

              <KafkaHealth />
            </div>
          </main>
        );

      case "Metrics":
        return (
          <MetricsPage
            metrics={metrics}
            setMetrics={setMetrics}
          />
        );

      case "Topology":
        return (
          <main className="min-h-screen bg-slate-950 p-8">
            <div className="mx-auto max-w-7xl space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Stream Topology
                </h1>

                <p className="mt-2 text-slate-400">
                  Kafka → Stream Processor → Database
                </p>
              </div>

              <StreamTopology />
            </div>
          </main>
        );

      case "Settings":
        return (
          <main className="min-h-screen bg-slate-950 p-8">
            <div className="mx-auto max-w-7xl space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Settings
                </h1>

                <p className="mt-2 text-slate-400">
                  StreamForge configuration.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-lg font-semibold text-white">
                    Backend
                  </h2>

                  <p className="mt-2 text-slate-400">
                    API
                  </p>

                  <p className="mt-1 text-green-400">
                    http://127.0.0.1:8000
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-lg font-semibold text-white">
                    Kafka
                  </h2>

                  <p className="mt-2 text-slate-400">
                    Bootstrap Server
                  </p>

                  <p className="mt-1 text-green-400">
                    localhost:9092
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-lg font-semibold text-white">
                    Input Topic
                  </h2>

                  <p className="mt-2 text-blue-400">
                    truck_telemetry
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-lg font-semibold text-white">
                    Changelog Topic
                  </h2>

                  <p className="mt-2 text-blue-400">
                    streamforge_state_changelog
                  </p>
                </div>

              </div>
            </div>
          </main>
        );

      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout
      activePage={activePage}
      onPageChange={setActivePage}
    >
      {renderPage()}
    </Layout>
  );
}

interface MetricsPageProps {
  metrics: Metrics | null;
  setMetrics: React.Dispatch<
    React.SetStateAction<Metrics | null>
  >;
}

function MetricsPage({
  metrics,
  setMetrics,
}: MetricsPageProps) {

  const loadMetrics = async () => {
    try {
      const data = await getMetrics();

      setMetrics(data);
    } catch (error) {
      console.error("Metrics error:", error);
    }
  };

  // Load metrics immediately when Metrics page opens
  useEffect(() => {
    loadMetrics();

    // Refresh every 5 seconds
    const interval = setInterval(
      loadMetrics,
      5000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Metrics
            </h1>

            <p className="mt-2 text-slate-400">
              Real-time StreamForge processing metrics.
            </p>
          </div>

          <button
            type="button"
            onClick={loadMetrics}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
          >
            Refresh Metrics
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

          <MetricBox
            title="Total Events"
            value={metrics?.total_events ?? 0}
          />

          <MetricBox
            title="Average Temperature"
            value={`${metrics?.average_temperature ?? 0} °C`}
          />

          <MetricBox
            title="Average Speed"
            value={`${metrics?.average_speed ?? 0} km/h`}
          />

          <MetricBox
            title="Average Fuel"
            value={`${metrics?.average_fuel ?? 0}%`}
          />

        </div>

        <EventChart />

      </div>
    </main>
  );
}

interface MetricBoxProps {
  title: string;
  value: string | number;
}

function MetricBox({
  title,
  value,
}: MetricBoxProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-white">
        {value}
      </p>

      <p className="mt-2 text-sm text-green-400">
        ● Live
      </p>

    </div>
  );
}

export default App;