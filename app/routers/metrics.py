from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.database.models import Event

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):
    events = db.query(Event).all()

    if len(events) == 0:
        return {
            "status": "success",
            "service": "StreamForge Backend",
            "total_events": 0,
            "average_temperature": 0,
            "average_speed": 0,
            "average_fuel": 0
        }

    total = len(events)

    avg_temp = sum(event.temperature for event in events) / total
    avg_speed = sum(event.speed for event in events) / total
    avg_fuel = sum(event.fuel for event in events) / total

    return {
        "status": "success",
        "service": "StreamForge Backend",
        "total_events": total,
        "average_temperature": round(avg_temp, 2),
        "average_speed": round(avg_speed, 2),
        "average_fuel": round(avg_fuel, 2)
    }