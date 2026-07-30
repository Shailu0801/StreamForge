export const kafkaHealth = {
  brokers: [
    { name: "Broker-01", status: "Online" },
    { name: "Broker-02", status: "Online" },
    { name: "Broker-03", status: "Online" },
  ],
  topics: 18,
  partitions: 64,
  consumerLag: "12 ms",
  throughput: "124K/s",
};