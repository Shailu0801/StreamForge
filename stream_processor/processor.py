from datetime import datetime


def get_status(temperature):
    if temperature < 0 or temperature > 10:
        return "critical"
    if temperature < 2 or temperature > 8:
        return "warning"
    return "normal"


def get_window_start(timestamp):
    event_time = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    window_minute = event_time.minute - (event_time.minute % 5)

    return event_time.replace(
        minute=window_minute,
        second=0,
        microsecond=0
    ).isoformat()


def process_event(event):
    truck_id = event.get("truck_id")

    if not truck_id:
        raise ValueError("missing truck_id")

    try:
        temperature = event["temperature"]
        speed = event["speed"]
        fuel = event["fuel"]
        timestamp = event["timestamp"]
    except KeyError as error:
        raise ValueError(f"missing {error}") from error

    if isinstance(temperature, bool) or not isinstance(temperature, (int, float)):
        raise ValueError("temperature must be a number")

    return {
    "truck_id": truck_id,
    "temperature": temperature,
    "speed": speed,
    "fuel": fuel,
    "location": event.get("location", "unknown"),
    "timestamp": timestamp,
    "window_start": get_window_start(timestamp),
    "status": get_status(temperature)
}