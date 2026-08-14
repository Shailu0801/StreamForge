from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.event import Event
from app.database.database import SessionLocal
from app.database.models import Event as EventModel

router = APIRouter()


# Database connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create Event
@router.post("/events")
def create_event(event: Event, db: Session = Depends(get_db)):

    new_event = EventModel(
        truck_id=event.truck_id,
        temperature=event.temperature,
        fuel=event.fuel,
        speed=event.speed,
        location=event.location
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return {
        "message": "Event saved successfully",
        "event": new_event
    }


# Get Events
@router.get("/events")
def get_events(db: Session = Depends(get_db)):

    events = db.query(EventModel).all()

    return events