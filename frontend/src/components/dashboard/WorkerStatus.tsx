import { useEffect, useState } from "react";
import Card from "../common/Card";

interface SystemStatus {
  backend: string;
  database: string;
  kafka: string;
  consumer: string;
  service: string;
  api_version: string;
}

const WorkerStatus = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/status");

        if (!response.ok) {
          throw new Error("Failed to fetch status");
        }

        const data: SystemStatus = await response.json();
        setStatus(data);
      } catch (error) {
        console.error("Status API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (value: string) => {
    return value === "Connected" ||
      value === "Running" ||
      value === "Running"
      ? "text-green-400"
      : "text-red-400";
  };

  return (
    <Card>
      <h2 className="mb-6 text-xl font-semibold text-white">
        ⚙️ System Status
      </h2>

      {loading && !status ? (
        <p className="text-slate-400">
          Loading status...
        </p>
      ) : status ? (
        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <span className="text-slate-400">
              Backend
            </span>

            <span className={getStatusClass(status.backend)}>
              ● {status.backend}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">
              Database
            </span>

            <span className={getStatusClass(status.database)}>
              ● {status.database}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">
              Kafka
            </span>

            <span className={getStatusClass(status.kafka)}>
              ● {status.kafka}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">
              Consumer
            </span>

            <span className={getStatusClass(status.consumer)}>
              ● {status.consumer}
            </span>
          </div>

          <div className="border-t border-slate-700 pt-4">

            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                Service
              </span>

              <span className="text-white">
                {status.service}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-slate-400">
                API Version
              </span>

              <span className="text-white">
                {status.api_version}
              </span>
            </div>

          </div>
        </div>
      ) : (
        <p className="text-red-400">
          Unable to connect to backend
        </p>
      )}
    </Card>
  );
};

export default WorkerStatus;