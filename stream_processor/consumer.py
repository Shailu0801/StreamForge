import json

from confluent_kafka import Consumer

from config import BOOTSTRAP_SERVERS, TOPIC_NAME, GROUP_ID
from processor import get_status, process_event


consumer = Consumer({
    "bootstrap.servers": BOOTSTRAP_SERVERS,
    "group.id": GROUP_ID,
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False
})

consumer.subscribe([TOPIC_NAME])

temperatures_by_window = {}

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

            key = (
                processed_event["truck_id"],
                processed_event["window_start"]
            )

            temperatures_by_window.setdefault(key, []).append(
                processed_event["temperature"]
            )

            temperatures = temperatures_by_window[key]
            average_temperature = sum(temperatures) / len(temperatures)
            average_status = get_status(average_temperature)

            print(
                f"Aggregate | {processed_event['truck_id']} | "
                f"Window: {processed_event['window_start']} | "
                f"Average: {average_temperature:.2f} C | "
                f"{average_status}"
            )

            print(
                f"Processed | {processed_event['truck_id']} | "
                f"{processed_event['temperature']} C | "
                f"{processed_event['status']}"
            )

        except (json.JSONDecodeError, UnicodeDecodeError, ValueError) as error:
            print(f"Invalid event skipped: {error}")

        consumer.commit(message=message, asynchronous=False)

except KeyboardInterrupt:
    print("\nConsumer stopped.")

finally:
    consumer.close()