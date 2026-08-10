from datetime import datetime


def get_status(temperature, active):
    if not active:
        return "inactive"
    if temperature < 8:
        return "normal"
    if temperature <= 10:
        return "warning"
    return "critical"


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
        active = event["active"]
        timestamp = event["timestamp"]
    except KeyError as error:
        raise ValueError(f"missing {error}") from error

    if isinstance(temperature, bool) or not isinstance(temperature, (int, float)):
        raise ValueError("temperature must be a number")

    if not isinstance(active, bool):
        raise ValueError("active must be true or false")

    return {
        "truck_id": truck_id,
        "temperature": temperature,
        "city": event.get("city", "unknown"),
        "timestamp": timestamp,
        "window_start": get_window_start(timestamp),
        "status": get_status(temperature, active)
    }