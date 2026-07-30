from fastapi import FastAPI
from app.routers import health, events, metrics, status
from app.database.database import engine
from app.database.models import Base
app = FastAPI(title="StreamForge Backend")
Base.metadata.create_all(bind=engine)

app.include_router(health.router)
app.include_router(events.router)
app.include_router(metrics.router)
app.include_router(status.router)

@app.get("/")
def home():
    return {"message": "Welcome to StreamForge Backend"}