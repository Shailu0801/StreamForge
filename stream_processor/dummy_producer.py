import json
from datetime import datetime, timezone

from confluent_kafka import Producer
from config import TOPIC_NAME, BOOTSTRAP_SERVERS

def delivery_report(error, message):
    if error is not None:
        print(f"Message failed : {error}")

    else:
        print(f"sent {message.key().decode()}")
        print(f"to{message.topic()}")
        print(f"partition{message.partition()}")

producer = Producer({"bootstrap.servers": BOOTSTRAP_SERVERS})

truck_events = [
    {
        "truck_id": "TRK-001",
        "temperature": 7.5,
        "city": "Delhi",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "active": True
    },
    {
        "truck_id": "TRK-002",
        "temperature": 9.2,
        "city": "Mumbai",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "active": True
    },
    {
        "truck_id": "TRK-003",
        "temperature": 12.0,
        "city": "Bengaluru",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "active": True
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