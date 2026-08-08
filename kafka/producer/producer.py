import json
import time

from confluent_kafka import Producer

from telemetry_generator import generate_event
from config import *


producer = Producer(KAFKA_CONFIG)


def delivery(err, msg):

    if err:

        print(err)

    else:

        print(
            f"Sent -> {msg.key().decode()} "
            f"Partition:{msg.partition()}"
        )


TOTAL_EVENTS = 1000

for i in range(TOTAL_EVENTS):

    event = generate_event()

    producer.produce(
        TOPIC,
        key=event["truck_id"],
        value=json.dumps(event)
    )

producer.flush()

print(f"Sent {TOTAL_EVENTS} events successfully.")

