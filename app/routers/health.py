from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health():
    return {
        "status": "Server is running",
        "service": "StreamForge Backend",
        "version": "1.0"
    }