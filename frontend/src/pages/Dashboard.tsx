import DashboardHeader from "../components/dashboard/DashboardHeader";
import MetricCard from "../components/dashboard/MetricCard";
import WorkerStatus from "../components/dashboard/WorkerStatus";
import KafkaHealth from "../components/dashboard/KafkaHealth";
import EventChart from "../components/charts/EventChart";
import StreamTopology from "../components/topology/StreamTopology";

import { metrics } from "../data/dashboard";

const Dashboard = () => {
  return (
    <main className="min-h-screen bg-slate-950 px-8 py-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <DashboardHeader />

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.title}
              metric={metric}
            />
          ))}
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