# StreamForge – Distributed Python Event Processor

## Project Overview

StreamForge is a distributed Python-based stream processing system designed to process large volumes of IoT truck telemetry data using Apache Kafka.

The system receives continuous telemetry events from trucks, distributes them across Kafka partitions, processes the events using Python workers, maintains state using RocksDB, exports monitoring metrics through Prometheus, and provides a React-based topology dashboard for monitoring workers, partitions, throughput, and system health.

## Problem Statement

Processing massive IoT data streams requires distributed processing, fault tolerance, state management, partition rebalancing, and reliable event processing.

StreamForge demonstrates how these capabilities can be implemented using a Python-based streaming architecture built around Apache Kafka.

## Architecture

```text
IoT Truck Telemetry
        |
        v
Apache Kafka
(truck_telemetry)
        |
        +----------------+
        |                |
        v                v
   Worker 1          Worker 2 ... Worker N
        |                |
        v                v
 Stream Processing & Windowed Aggregation
        |
        v
     RocksDB
   Local State
        |
        v
Kafka Changelog
        |
        v
State Recovery
        |
        +----------------------+
        |                      |
        v                      v
 Prometheus              FastAPI Backend
 Metrics                      |
        |                      v
        +------------> React Flow Dashboard
```

## Key Features

* Apache Kafka event streaming
* Kafka topic partitioning
* Multiple Python stream-processing workers
* Temperature filtering and event processing
* 5-minute windowed/rolling temperature aggregation per truck
* Handling of late-arriving events
* Worker-specific state management using RocksDB
* Kafka changelog-based state recovery
* Kafka consumer-group partition rebalancing
* Worker failure and recovery testing
* Processing-lag monitoring
* Events-per-second monitoring
* Prometheus metrics
* FastAPI backend APIs
* React-based streaming topology dashboard
* Worker and partition monitoring
* Docker-based Kafka infrastructure

## Technology Stack

### Stream Processing

* Python
* Apache Kafka
* `confluent-kafka`

### State Management

* RocksDB
* Kafka changelog topic

### Backend

* FastAPI
* SQLAlchemy
* SQLite

### Monitoring

* Prometheus
* Prometheus Python client

### Frontend

* React
* TypeScript
* React Flow
* Tailwind CSS

### Infrastructure

* Docker
* Docker Compose

## Kafka Topics

### Input Topic

```text
truck_telemetry
```

The telemetry stream is partitioned across multiple Kafka partitions for parallel processing.

### State Changelog Topic

```text
streamforge_state_changelog
```

The changelog is used to support state recovery when a worker fails.

## Processing Flow

Each telemetry event contains truck-related information such as:

```text
Truck ID
Temperature
Speed
Fuel
Timestamp
```

The processing pipeline performs operations such as:

```text
Consume
   ↓
Validate / Filter
   ↓
Process telemetry
   ↓
Windowed aggregation
   ↓
Update state
   ↓
Persist state
   ↓
Export metrics
```

## Windowed Aggregation

StreamForge maintains temperature aggregation for individual trucks using a 5-minute processing window.

The system uses event timestamps to determine the appropriate aggregation window and supports late-arriving telemetry events.

## Fault Tolerance and State Recovery

StreamForge uses Kafka consumer groups to distribute partitions among Python workers.

When a worker fails:

```text
Worker Failure
      ↓
Kafka detects consumer failure
      ↓
Partition Rebalancing
      ↓
Another worker receives the partition
      ↓
State recovered from RocksDB / Kafka changelog
      ↓
Processing continues
```

This demonstrates distributed worker recovery and stateful stream processing.

## Monitoring

Prometheus metrics are exposed by the stream-processing workers.

Important metrics include:

* Events processed
* Events per second
* Processing lag
* Processing errors
* Average temperature
* Average speed
* Average fuel
* Consumer running status

These metrics are integrated into the StreamForge monitoring dashboard.

## React Flow Topology Dashboard

The frontend provides a visual representation of the streaming system.

The dashboard can be used to monitor:

* Kafka partitions
* Stream-processing workers
* Worker health
* Processing metrics
* System status
* Processing throughput
* Streaming topology

## FastAPI APIs

The backend exposes APIs including:

```text
GET  /health
GET  /events
POST /events
GET  /metrics
GET  /events/chart
GET  /prometheus
GET  /status
GET  /kafka-health
```

Swagger documentation is automatically available through FastAPI.

## Performance Testing

The project includes throughput testing to evaluate high-volume event processing.

The system was tested against the project target of processing approximately:

```text
100,000 events/second
```

across multiple Kafka partitions/workers.

## Failure Testing

The project includes chaos/failure testing in which a Python worker is terminated during processing.

The system demonstrates:

1. Worker failure detection
2. Kafka partition rebalancing
3. Partition reassignment
4. State recovery
5. Continued event processing

## Project Structure

```text
StreamForge/
│
├── app/
│   ├── database/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   └── utils/
│
├── frontend/
│   └── src/
│
├── kafka/
│
├── stream_processor/
│   ├── consumer.py
│   ├── processor.py
│   ├── database.py
│   ├── state_store.py
│   ├── metrics.py
│   ├── dummy_producer.py
│   └── config.py
│
├── docker-compose.yml
├── prometheus.yml
├── main.py
└── README.md
```

## Running the Project

### 1. Activate the Python environment

```powershell
venv\Scripts\activate
```

### 2. Start the Docker infrastructure

```powershell
docker compose up -d
```

### 3. Start the FastAPI backend

```powershell
uvicorn main:app --reload
```

### 4. Start the stream processor

```powershell
python -m stream_processor.consumer
```

### 5. Start the frontend

From the frontend directory:

```powershell
cd frontend
npm install
npm run dev
```

### 6. Open the application

FastAPI:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

Frontend:

```text
http://localhost:5173
```

## Project Status

### Completed

* Kafka event ingestion
* Kafka partitioning
* Python stream processing
* Windowed aggregation
* Late-event handling
* RocksDB state management
* Kafka changelog
* Worker recovery
* Partition rebalancing
* Prometheus metrics
* React Flow topology dashboard
* FastAPI monitoring APIs
* Throughput testing
* Failure/chaos testing

## Project Goal

StreamForge demonstrates the design and implementation of a distributed Python stream-processing architecture capable of handling high-volume IoT telemetry while providing state management, worker recovery, partition rebalancing, monitoring, and a visual streaming topology.

## Author

**Shailu**
