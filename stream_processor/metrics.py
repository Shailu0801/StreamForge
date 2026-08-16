from prometheus_client import Counter, Gauge, start_http_server


# ============================================================
# STREAMFORGE PROMETHEUS METRICS
# ============================================================

EVENTS_PROCESSED = Counter(
    "streamforge_events_processed_total",
    "Total number of truck telemetry events processed"
)

EVENTS_PER_SECOND = Gauge(
    "streamforge_events_per_second",
    "Number of truck telemetry events processed per second"
)

PROCESSING_LAG = Gauge(
    "streamforge_processing_lag",
    "Number of Kafka messages waiting to be processed"
)

PROCESSING_ERRORS = Counter(
    "streamforge_processing_errors_total",
    "Total number of processing errors"
)

AVERAGE_TEMPERATURE = Gauge(
    "streamforge_average_temperature_celsius",
    "Average truck temperature"
)

AVERAGE_SPEED = Gauge(
    "streamforge_average_speed_kmh",
    "Average truck speed"
)

AVERAGE_FUEL = Gauge(
    "streamforge_average_fuel_percent",
    "Average truck fuel percentage"
)

CONSUMER_RUNNING = Gauge(
    "streamforge_consumer_running",
    "Whether the StreamForge consumer is running"
)


# ============================================================
# METRICS SERVER
# ============================================================

def start_metrics_server(port=8001):
    """
    Start Prometheus metrics HTTP server.
    """

    start_http_server(port)

    print(
        f"Prometheus metrics server running on port {port}"
    )


# ============================================================
# METRIC UPDATE FUNCTIONS
# ============================================================

def mark_event_processed():
    EVENTS_PROCESSED.inc()


def set_events_per_second(value):
    EVENTS_PER_SECOND.set(value)


def set_processing_lag(value):
    PROCESSING_LAG.set(value)


def mark_processing_error():
    PROCESSING_ERRORS.inc()


def set_average_temperature(value):
    AVERAGE_TEMPERATURE.set(value)


def set_average_speed(value):
    AVERAGE_SPEED.set(value)


def set_average_fuel(value):
    AVERAGE_FUEL.set(value)


def set_consumer_running(value):
    CONSUMER_RUNNING.set(value)