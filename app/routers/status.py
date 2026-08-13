from fastapi import APIRouter
from sqlalchemy import text
from kafka import  KafkaAdminClient

from app.database.database import SessionLocal

router = APIRouter()


@router.get("/status")
def get_status():

    db_status = "Disconnected"
    kafka_status = "Disconnected"

    # Database Check
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db_status = "Connected"
        db.close()
    except Exception:
        db_status = "Disconnected"

    # Kafka Check
    try:
        admin = KafkaAdminClient(
            bootstrap_servers="localhost:9092",
            client_id="streamforge"
        )
        kafka_status = "Connected"
        admin.close()
    except Exception:
        kafka_status = "Disconnected"

    return {
        "backend": "Running",
        "database": db_status,
        "kafka": kafka_status,
        "consumer": "Not Running",
        "service": "StreamForge Backend",
        "api_version": "1.0"
    }