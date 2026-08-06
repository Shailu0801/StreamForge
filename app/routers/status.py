from fastapi import APIRouter

router = APIRouter()


@router.get("/status")
def get_status():
    return {
        "backend": "Running",
        "database": "Connected",
        "kafka": "Not Connected",
        "consumer": "Not Running",
        "api_version": "1.0",
        "service": "StreamForge Backend"
    }