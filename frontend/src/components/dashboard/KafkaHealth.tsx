import Card from "../common/Card";
import { kafkaHealth } from "../../data/kafka";

const KafkaHealth = () => {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-white mb-6">
        📡 Kafka Health
      </h2>

      <div className="space-y-4">
        {kafkaHealth.brokers.map((broker) => (
          <div
            key={broker.name}
            className="flex justify-between items-center"
          >
            <span className="text-slate-300">
              {broker.name}
            </span>

            <span className="text-green-400">
              🟢 {broker.status}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 mt-6 pt-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Topics</span>
          <span className="text-white">{kafkaHealth.topics}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Partitions</span>
          <span className="text-white">{kafkaHealth.partitions}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Consumer Lag</span>
          <span className="text-white">{kafkaHealth.consumerLag}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Throughput</span>
          <span className="text-blue-400 font-semibold">
            {kafkaHealth.throughput}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default KafkaHealth;