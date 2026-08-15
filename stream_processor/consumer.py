import json
import os

from confluent_kafka import Consumer, Producer

from stream_processor.config import (
    BOOTSTRAP_SERVERS,
    TOPIC_NAME,
    GROUP_ID
)

from stream_processor.processor import (
    get_status,
    process_event
)

from stream_processor.database import save_event
from stream_processor.state_store import StateStore


# ============================================================
# CONFIGURATION
# ============================================================

WORKER_ID = os.getenv("WORKER_ID", "worker1")

CHANGELOG_TOPIC = "streamforge_state_changelog"


# ============================================================
# KAFKA CONSUMER
# ============================================================

consumer = Consumer({
    "bootstrap.servers": BOOTSTRAP_SERVERS,
    "group.id": GROUP_ID,
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False
})


# ============================================================
# KAFKA PRODUCER
# ============================================================

producer = Producer({
    "bootstrap.servers": BOOTSTRAP_SERVERS
})


# ============================================================
# SUBSCRIBE TO INPUT TOPIC
# ============================================================

consumer.subscribe([TOPIC_NAME])


# ============================================================
# WORKER-SPECIFIC ROCKSDB
# ============================================================

state_store = StateStore(WORKER_ID)


print("==============================================")
print("        StreamForge Stream Processor")
print("==============================================")
print(f"Worker ID       : {WORKER_ID}")
print(f"Input Topic     : {TOPIC_NAME}")
print(f"Changelog Topic : {CHANGELOG_TOPIC}")
print(f"Consumer Group  : {GROUP_ID}")
print("==============================================")
print()
print(f"Waiting for messages from '{TOPIC_NAME}'...")
print("Press Ctrl + C to stop.\n")


# ============================================================
# CHANGELOG DELIVERY CALLBACK
# ============================================================

def delivery_report(err, msg):
    if err is not None:
        print(
            f"Changelog delivery failed: {err}"
        )
    else:
        print(
            f"Changelog saved | "
            f"partition={msg.partition()} | "
            f"offset={msg.offset()}"
        )


# ============================================================
# MAIN PROCESSING LOOP
# ============================================================

try:

    while True:

        # ----------------------------------------------------
        # Poll Kafka
        # ----------------------------------------------------

        message = consumer.poll(1.0)

        if message is None:
            continue


        # ----------------------------------------------------
        # Kafka error
        # ----------------------------------------------------

        if message.error():

            print(
                f"Kafka error: {message.error()}"
            )

            continue


        try:

            # =================================================
            # 1. READ EVENT
            # =================================================

            event = json.loads(
                message.value().decode("utf-8")
            )


            # =================================================
            # 2. PROCESS EVENT
            # =================================================

            processed_event = process_event(event)


            # =================================================
            # 3. SAVE EVENT TO DATABASE
            # =================================================

            save_event(processed_event)


            # =================================================
            # 4. CREATE WINDOW STATE KEY
            # =================================================

            state_key = (
                f"{processed_event['truck_id']}"
                f"|"
                f"{processed_event['window_start']}"
            )


            # =================================================
            # 5. LOAD STATE FROM ROCKSDB
            # =================================================

            state = state_store.get_window_state(
                state_key
            )


            if state is None:

                state = {
                    "count": 0,
                    "temperature_sum": 0.0
                }


            # =================================================
            # 6. UPDATE STATE
            # =================================================

            state["count"] += 1

            state["temperature_sum"] += float(
                processed_event["temperature"]
            )


            # =================================================
            # 7. CALCULATE WINDOW AVERAGE
            # =================================================

            average_temperature = (
                state["temperature_sum"]
                / state["count"]
            )


            average_status = get_status(
                average_temperature
            )


            # =================================================
            # 8. SAVE STATE TO ROCKSDB
            # =================================================

            state_store.save_window_state(
                state_key,
                state
            )


            # =================================================
            # 9. CREATE CHANGELOG RECORD
            # =================================================

            changelog_record = {

                "worker_id": WORKER_ID,

                "key": state_key,

                "state": {

                    "count": state["count"],

                    "temperature_sum":
                        state["temperature_sum"]

                }

            }


            # =================================================
            # 10. PUBLISH STATE TO KAFKA CHANGELOG
            # =================================================

            producer.produce(
                topic=CHANGELOG_TOPIC,

                key=state_key.encode("utf-8"),

                value=json.dumps(
                    changelog_record
                ).encode("utf-8"),

                callback=delivery_report
            )


            # ------------------------------------------------
            # Process producer delivery events
            # ------------------------------------------------

            producer.poll(0)


            # =================================================
            # 11. DISPLAY AGGREGATION
            # =================================================

            print(
                f"Aggregate | "
                f"{processed_event['truck_id']} | "
                f"Window: "
                f"{processed_event['window_start']} | "
                f"Count: {state['count']} | "
                f"Average: "
                f"{average_temperature:.2f} C | "
                f"{average_status}"
            )


            # =================================================
            # 12. DISPLAY PROCESSED EVENT
            # =================================================

            print(
                f"Processed | "
                f"{processed_event['truck_id']} | "
                f"{processed_event['temperature']} C | "
                f"{processed_event['status']}"
            )


            # =================================================
            # 13. COMMIT KAFKA OFFSET
            # =================================================

            consumer.commit(
                message=message,
                asynchronous=False
            )


        except (
            json.JSONDecodeError,
            UnicodeDecodeError,
            ValueError
        ) as error:

            print(
                f"Invalid event skipped: {error}"
            )

            # Commit invalid event so it does not
            # repeatedly block the partition.

            consumer.commit(
                message=message,
                asynchronous=False
            )


        except Exception as error:

            print(
                f"Processing error: {error}"
            )

            # Do NOT commit here.
            # Kafka can redeliver the message after restart.


except KeyboardInterrupt:

    print("\nConsumer stopped.")


finally:

    # ========================================================
    # FLUSH REMAINING CHANGELOG MESSAGES
    # ========================================================

    print("\nFlushing changelog messages...")

    producer.flush()


    # ========================================================
    # CLOSE ROCKSDB
    # ========================================================

    state_store.close()


    # ========================================================
    # CLOSE KAFKA CONSUMER
    # ========================================================

    consumer.close()

    print("StreamForge worker shutdown complete.")