import json
from datetime import datetime, timezone

from confluent_kafka import Producer
from stream_processor.config import TOPIC_NAME, BOOTSTRAP_SERVERS


def delivery_report(error, message):
    if error is not None:
        print(f"Message failed: {error}")
    else:
        print(f"sent {message.key().decode()}")
        print(f"to {message.topic()}")
        print(f"partition {message.partition()}")


producer = Producer({
    "bootstrap.servers": BOOTSTRAP_SERVERS
})


truck_events = [
    {
        "truck_id": "TRK-001",
        "temperature": 22.5,
        "fuel": 68.4,
        "speed": 58.2,
        "location": "Delhi",
        "timestamp": datetime.now(timezone.utc).isoformat()
    },
    {
        "truck_id": "TRK-002",
        "temperature": 24.1,
        "fuel": 72.8,
        "speed": 61.5,
        "location": "Mumbai",
        "timestamp": datetime.now(timezone.utc).isoformat()
    },
    {
        "truck_id": "TRK-003",
        "temperature": 19.8,
        "fuel": 55.6,
        "speed": 52.7,
        "location": "Bengaluru",
        "timestamp": datetime.now(timezone.utc).isoformat()
    },
    {
        "truck_id": "TRK-001",
        "temperature": 23.4,
        "fuel": 66.9,
        "speed": 60.1,
        "location": "Delhi",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
]


for event in truck_events:
    producer.produce(
        TOPIC_NAME,
        key=event["truck_id"],
        value=json.dumps(event).encode("utf-8"),
        callback=delivery_report
    )

    producer.poll(0)


producer.flush()

print("Dummy truck events sent.")