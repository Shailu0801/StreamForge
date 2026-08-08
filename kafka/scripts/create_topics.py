from confluent_kafka.admin import AdminClient, NewTopic

admin = AdminClient({
    "bootstrap.servers": "localhost:9092"
})

topic = NewTopic(
    topic="truck_telemetry",
    num_partitions=6,
    replication_factor=1
)

admin.create_topics([topic])

print("Topic Created")