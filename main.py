from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, events, metrics, status, kafka
from app.database.database import engine
from app.database.models import Base
from app.database.database import engine
from app.database.models import Base
app = FastAPI(title="StreamForge Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

app.include_router(health.router)
app.include_router(events.router)
app.include_router(metrics.router)
app.include_router(status.router)
app.include_router(kafka.router)

@app.get("/")
def home():
    return {"message": "Welcome to StreamForge Backend"}