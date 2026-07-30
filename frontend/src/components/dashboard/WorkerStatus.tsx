import Card from "../common/Card";
import { workers } from "../../data/workers";

const WorkerStatus = () => {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-white mb-6">
        👷 Worker Status
      </h2>

      <div className="space-y-6">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="border-b border-slate-700 pb-5 last:border-none"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold">
                {worker.id}
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  worker.status === "Running"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {worker.status}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm text-slate-400">
                <span>CPU</span>
                <span>{worker.cpu}%</span>
              </div>

              <div className="w-full h-2 bg-slate-700 rounded-full mt-1">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${worker.cpu}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Memory</span>
                <span>{worker.memory}%</span>
              </div>

              <div className="w-full h-2 bg-slate-700 rounded-full mt-1">
                <div
                  className="h-2 rounded-full bg-cyan-400"
                  style={{ width: `${worker.memory}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WorkerStatus;