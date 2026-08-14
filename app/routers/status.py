from fastapi import APIRouter
from sqlalchemy import text
from kafka import  KafkaAdminClient

from app.database.database import SessionLocal

router = APIRouter()

BOOTSTRAP_SERVERS = "localhost:9092"
GROUP_ID = "streamforge-processor"


@router.get("/status")
def get_status():

    db_status = "Disconnected"
    kafka_status = "Disconnected"
    consumer_status = "Not Running"

    # -------------------------
    # Database Check
    # -------------------------
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db_status = "Connected"
        db.close()
    except Exception:
        db_status = "Disconnected"

    # -------------------------
    # Kafka + Consumer Check
    # -------------------------
    try:
        admin = KafkaAdminClient(
            bootstrap_servers=BOOTSTRAP_SERVERS,
            client_id="streamforge-status"
        )

        kafka_status = "Connected"

        try:
            result = admin.describe_groups([GROUP_ID])
            group = result.get(GROUP_ID)

            if group:
                group_state = group.get("group_state")
                members = group.get("members", [])

                if group_state == "Stable" and len(members) > 0:
                    consumer_status = "Running"

        except Exception as error:
            print(f"Consumer status check error: {error}")

        admin.close()

    except Exception:
        kafka_status = "Disconnected"

    return {
        "backend": "Running",
        "database": db_status,
        "kafka": kafka_status,
        "consumer": consumer_status,
        "service": "StreamForge Backend",
        "api_version": "1.0"
    }