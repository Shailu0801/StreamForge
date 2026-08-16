import json
import os
import time

from confluent_kafka import Consumer, Producer
from prometheus_client import (
    start_http_server,
)

from stream_processor.config import (
    BOOTSTRAP_SERVERS,
    TOPIC_NAME,
    GROUP_ID,
)

from stream_processor.processor import (
    get_status,
    process_event,
)

from stream_processor.database import save_event
from stream_processor.state_store import StateStore

from stream_processor.metrics import (
    start_metrics_server,
    mark_event_processed,
    set_events_per_second,
    set_processing_lag,
    mark_processing_error,
    set_average_temperature,
    set_average_speed,
    set_average_fuel,
    set_consumer_running,
)


# ============================================================
# CONFIGURATION
# ============================================================

WORKER_ID = os.getenv(
    "WORKER_ID",
    "worker1",
)

CHANGELOG_TOPIC = "streamforge_state_changelog"

METRICS_PORT = int(
    os.getenv(
        "METRICS_PORT",
        "9100",
    )
)


# ============================================================
# KAFKA CONSUMER
# ============================================================

consumer = Consumer(
    {
        "bootstrap.servers": BOOTSTRAP_SERVERS,
        "group.id": GROUP_ID,
        "auto.offset.reset": "earliest",
        "enable.auto.commit": False,
    }
)


# ============================================================
# KAFKA PRODUCER
# ============================================================

producer = Producer(
    {
        "bootstrap.servers": BOOTSTRAP_SERVERS,
    }
)


# ============================================================
# SUBSCRIBE TO INPUT TOPIC
# ============================================================

consumer.subscribe(
    [TOPIC_NAME]
)


# ============================================================
# PROMETHEUS SERVER
# ============================================================

start_metrics_server(
    METRICS_PORT
)

set_consumer_running(1)


# ============================================================
# WORKER-SPECIFIC ROCKSDB
# ============================================================

state_store = StateStore(
    WORKER_ID
)


# ============================================================
# EVENT RATE TRACKING
# ============================================================

rate_start_time = time.time()

rate_event_count = 0


# ============================================================
# STARTUP INFORMATION
# ============================================================

print(
    "=============================================="
)

print(
    "        StreamForge Stream Processor"
)

print(
    "=============================================="
)

print(
    f"Worker ID       : {WORKER_ID}"
)

print(
    f"Input Topic     : {TOPIC_NAME}"
)

print(
    f"Changelog Topic : {CHANGELOG_TOPIC}"
)

print(
    f"Consumer Group  : {GROUP_ID}"
)

print(
    f"Metrics Port    : {METRICS_PORT}"
)

print(
    "=============================================="
)

print()

print(
    f"Waiting for messages from '{TOPIC_NAME}'..."
)

print(
    "Press Ctrl + C to stop."
)

print()


# ============================================================
# CHANGELOG DELIVERY CALLBACK
# ============================================================

def delivery_report(
    err,
    msg,
):

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
# KAFKA LAG CALCULATION
# ============================================================

def update_processing_lag():

    try:

        lag = 0

        partitions = consumer.assignment()

        if not partitions:
            set_processing_lag(0)
            return

        positions = consumer.position(
            partitions
        )

        for partition, position in zip(
            partitions,
            positions
        ):

            if position is None:
                continue

            if position.offset < 0:
                continue

            try:

                low, high = (
                    consumer.get_watermark_offsets(
                        partition,
                        timeout=1.0
                    )
                )

                partition_lag = max(
                    0,
                    high - position.offset
                )

                lag += partition_lag

            except Exception as partition_error:

                print(
                    "Partition lag calculation error: "
                    f"{partition_error}"
                )

        set_processing_lag(
            lag
        )

    except Exception as error:

        print(
            f"Lag calculation error: {error}"
        )

        set_processing_lag(0)


# ============================================================
# MAIN PROCESSING LOOP
# ============================================================

try:

    while True:

        # ====================================================
        # 1. POLL KAFKA
        # ====================================================

        message = consumer.poll(
            1.0
        )

        if message is None:

            continue


        # ====================================================
        # 2. KAFKA ERROR
        # ====================================================

        if message.error():

            print(
                f"Kafka error: {message.error()}"
            )

            continue


        try:

            # =================================================
            # 3. READ EVENT
            # =================================================

            event = json.loads(
                message.value().decode(
                    "utf-8"
                )
            )


            # =================================================
            # 4. PROCESS EVENT
            # =================================================

            processed_event = process_event(
                event
            )


            # =================================================
            # 5. SAVE EVENT TO DATABASE
            # =================================================

            save_event(
                processed_event
            )


            # =================================================
            # 6. CREATE WINDOW STATE KEY
            # =================================================

            state_key = (
                f"{processed_event['truck_id']}"
                f"|"
                f"{processed_event['window_start']}"
            )


            # =================================================
            # 7. LOAD STATE FROM ROCKSDB
            # =================================================

            state = (
                state_store.get_window_state(
                    state_key
                )
            )


            if state is None:

                state = {
                    "count": 0,
                    "temperature_sum": 0.0,
                }


            # =================================================
            # 8. UPDATE STATE
            # =================================================

            state["count"] += 1

            state["temperature_sum"] += float(
                processed_event[
                    "temperature"
                ]
            )


            # =================================================
            # 9. CALCULATE WINDOW AVERAGE
            # =================================================

            average_temperature = (
                state["temperature_sum"]
                / state["count"]
            )


            average_status = get_status(
                average_temperature
            )


            # =================================================
            # 10. SAVE STATE TO ROCKSDB
            # =================================================

            state_store.save_window_state(
                state_key,
                state,
            )


            # =================================================
            # 11. CREATE CHANGELOG RECORD
            # =================================================

            changelog_record = {

                "worker_id": WORKER_ID,

                "key": state_key,

                "state": {

                    "count": state[
                        "count"
                    ],

                    "temperature_sum":
                        state[
                            "temperature_sum"
                        ],

                },

            }


            # =================================================
            # 12. PUBLISH CHANGELOG
            # =================================================

            producer.produce(

                topic=CHANGELOG_TOPIC,

                key=state_key.encode(
                    "utf-8"
                ),

                value=json.dumps(
                    changelog_record
                ).encode(
                    "utf-8"
                ),

                callback=delivery_report,

            )


            producer.poll(
                0
            )


            # =================================================
            # 13. DISPLAY AGGREGATION
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
            # 14. DISPLAY PROCESSED EVENT
            # =================================================

            print(

                f"Processed | "
                f"{processed_event['truck_id']} | "
                f"{processed_event['temperature']} C | "
                f"{processed_event['status']}"

            )


            # =================================================
            # 15. UPDATE EVENT COUNTER
            # =================================================

            mark_event_processed()


            # =================================================
            # 16. UPDATE TEMPERATURE METRIC
            # =================================================

            set_average_temperature(
                average_temperature
            )


            # =================================================
            # 17. UPDATE SPEED METRIC
            # =================================================

            if "speed" in processed_event:

                set_average_speed(
                    float(
                        processed_event[
                            "speed"
                        ]
                    )
                )


            # =================================================
            # 18. UPDATE FUEL METRIC
            # =================================================

            if "fuel" in processed_event:

                set_average_fuel(
                    float(
                        processed_event[
                            "fuel"
                        ]
                    )
                )


            # =================================================
            # 19. EVENTS PER SECOND
            # =================================================

            rate_event_count += 1

            elapsed = (
                time.time()
                - rate_start_time
            )


            if elapsed >= 1.0:

                rate = (
                    rate_event_count
                    / elapsed
                )

                print(
                    f"Processing rate: "
                    f"{rate:.2f} events/sec"
                )

                set_events_per_second(
                    rate
                )

                rate_event_count = 0

                rate_start_time = (
                    time.time()
                )


            # =================================================
            # 20. COMMIT KAFKA OFFSET
            # =================================================

            consumer.commit(

                message=message,

                asynchronous=False,

            )


            # =================================================
            # 21. UPDATE PROCESSING LAG
            # =================================================

            update_processing_lag()


        # =====================================================
        # INVALID EVENT
        # =====================================================

        except (
            json.JSONDecodeError,
            UnicodeDecodeError,
            ValueError,
        ) as error:

            print(
                f"Invalid event skipped: {error}"
            )


            consumer.commit(

                message=message,

                asynchronous=False,

            )


        # =====================================================
        # PROCESSING ERROR
        # =====================================================

        except Exception as error:

            mark_processing_error()


            print(
                f"Processing error: {error}"
            )

            # IMPORTANT:
            # Do NOT commit the message here.
            #
            # Kafka can redeliver the message
            # after the worker restarts.


# ============================================================
# KEYBOARD INTERRUPT
# ============================================================

except KeyboardInterrupt:

    print(
        "\nConsumer stopped."
    )


# ============================================================
# SHUTDOWN
# ============================================================

finally:

    print(
        "\nShutting down StreamForge worker..."
    )


    # ========================================================
    # MARK CONSUMER AS NOT RUNNING
    # ========================================================

    set_consumer_running(
        0
    )


    # ========================================================
    # FLUSH CHANGELOG
    # ========================================================

    print(
        "Flushing changelog messages..."
    )

    producer.flush()


    # ========================================================
    # CLOSE ROCKSDB
    # ========================================================

    state_store.close()


    # ========================================================
    # CLOSE KAFKA CONSUMER
    # ========================================================

    consumer.close()


    print(
        "StreamForge worker shutdown complete."
    )