import { Activity, RefreshCw } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/20">
          <Activity className="h-8 w-8 text-white" />
        </div>

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Real-Time Event Processing Dashboard
          </h1>

          <p className="mt-2 text-slate-400 text-lg">
            Monitor Kafka streams, distributed workers, event throughput and
            RocksDB state in real time.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <button
        className="
          flex items-center gap-2
          rounded-xl
          bg-blue-600
          px-5 py-3
          font-medium
          text-white
          shadow-lg shadow-blue-600/20
          transition-all duration-300
          hover:-translate-y-1
          hover:bg-blue-500
        "
      >
        <RefreshCw size={18} />
        Refresh Metrics
      </button>
    </div>
  );
};

export default DashboardHeader;