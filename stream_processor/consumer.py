import json

from confluent_kafka import Consumer
from config import BOOTSTRAP_SERVERS, TOPIC_NAME, GROUP_ID
from processor import process_event

consumer = Consumer({
    "bootstrap.servers": BOOTSTRAP_SERVERS,
    "group.id": GROUP_ID,
    "auto.offset.reset": "earliest"
})

consumer.subscribe([TOPIC_NAME])

print(f"Waiting for messages from '{TOPIC_NAME}'...")
print("Press Ctrl + C to stop.\n")

try:
    while True:
        message = consumer.poll(1.0)

        if message is None:
            continue

        if message.error():
            print(f"Kafka error: {message.error()}")
            continue
        try:
            event = json.loads(message.value().decode("utf-8"))
            processed_event = process_event(event)

            print(
                f"Processed | "
                f"{processed_event['truck_id']} | "
                f"{processed_event['temperature']}°C | "
                f"{processed_event['status']} | "
                f"Window: {processed_event['window_start']}"
            )

        except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as error:
            print(f"Invalid event skipped: {error}")

except KeyboardInterrupt:
    print("\nConsumer stopped.")

finally:
    consumer.close()