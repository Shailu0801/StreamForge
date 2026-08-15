from datetime import datetime

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.database.models import Event


def save_event(processed_event):
    db: Session = SessionLocal()

    try:
        timestamp_value = processed_event.get("timestamp")

        if isinstance(timestamp_value, str):
            timestamp_value = datetime.fromisoformat(
                timestamp_value
            )

        event = Event(
            truck_id=processed_event["truck_id"],
            temperature=processed_event["temperature"],
            fuel=processed_event["fuel"],
            speed=processed_event["speed"],
            location=processed_event.get("location", "unknown"),
            timestamp=timestamp_value,
        )

        db.add(event)
        db.commit()
        db.refresh(event)

        return event.id

    finally:
        db.close()