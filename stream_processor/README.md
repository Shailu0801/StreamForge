# StreamForge Kafka Consumer & Processing

This module consumes live truck telemetry from Apache Kafka, validates every event, calculates a five-minute per-truck temperature average, and assigns a temperature status.

## Input event format

```json
{
  "truck_id": "TRUCK-123",
  "temperature": 8.5,
  "speed": 60,
  "fuel": 70,
  "timestamp": "2026-08-10T10:30:00"
}
```

## Processing rules

- `2 C` to `8 C`: normal
- `0 C` to `2 C`, or `8 C` to `10 C`: warning
- Below `0 C` or above `10 C`: critical

The consumer groups valid readings by truck ID and five-minute timestamp window, then recalculates the average whenever a new event arrives.

## Setup

1. Start Docker Desktop.
2. From this folder, start local Kafka:

```powershell
docker compose -f compose.dev.yml up -d
```

3. Install the Python dependency:

```powershell
python -m pip install -r requirements.txt
```

## Run the consumer

From the `stream_processor` folder:

```powershell
python consumer.py
```

## Run the producer

In another terminal, from the `kafka/producer` folder:

```powershell
python producer.py
```

The producer sends simulated truck telemetry to the `truck_telemetry` Kafka topic. The consumer prints processed events and live five-minute aggregate results.

## Configuration

Update `config.py` when the Kafka broker address, topic name, or consumer group changes.