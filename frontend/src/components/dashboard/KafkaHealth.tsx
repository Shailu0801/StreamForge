import { useEffect, useState } from "react";
import Card from "../common/Card";
import { getKafkaHealth } from "../../api/backend";
import type { KafkaHealth as KafkaHealthData } from "../../api/backend";

const KafkaHealth = () => {
  const [health, setHealth] = useState<KafkaHealthData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadKafkaHealth = async () => {
      try {
        const data = await getKafkaHealth();
        setHealth(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to connect to Kafka");
      }
    };

    loadKafkaHealth();

    const interval = setInterval(loadKafkaHealth, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <h2 className="text-xl font-semibold text-white mb-6">
        📡 Kafka Health
      </h2>

      {error && (
        <p className="mb-4 text-red-400">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {health?.brokers.map((broker) => (
          <div
            key={broker.id}
            className="flex justify-between items-center"
          >
            <span className="text-slate-300">
              Broker-{broker.id}
            </span>

            <span className="text-green-400">
              🟢 Online
            </span>
          </div>
        ))}
      </div>

      {health && (
        <div className="border-t border-slate-700 mt-6 pt-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Status</span>
            <span className="text-green-400">
              {health.status}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Topics</span>
            <span className="text-white">
              {health.topics}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Topic Names</span>
            <span className="text-white">
              {health.topic_names.join(", ")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Partitions</span>
            <span className="text-white">
              {health.partitions}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default KafkaHealth;