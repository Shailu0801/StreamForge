# StreamForge Backend

## Project Description

StreamForge is a distributed event processing system built using FastAPI. It receives IoT truck telemetry data, stores it in a SQLite database, and provides APIs to monitor events and system status.

---

## Technologies Used

- Python
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn

---

## Available APIs

- GET /health
- POST /events
- GET /events
- GET /metrics
- GET /status

---

## How to Run the Backend

### Step 1

Activate the virtual environment:

```bash
venv\Scripts\activate
```

### Step 2

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

### Step 3

Open Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

## Author

Shailu