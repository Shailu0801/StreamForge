from fastapi import APIRouter
from confluent_kafka.admin import AdminClient

router = APIRouter()

BOOTSTRAP_SERVERS = "localhost:9092"


@router.get("/kafka-health")
def get_kafka_health():
    try:
        admin_client = AdminClient({
            "bootstrap.servers": BOOTSTRAP_SERVERS
        })

        metadata = admin_client.list_topics(timeout=5)

        topics = [
            topic
            for topic in metadata.topics
            if not topic.startswith("__")
        ]

        partition_count = sum(
            len(metadata.topics[topic].partitions)
            for topic in topics
        )

        brokers = [
            {
                "id": broker.id,
                "host": broker.host,
                "port": broker.port
            }
            for broker in metadata.brokers.values()
        ]

        return {
            "status": "Connected",
            "brokers": brokers,
            "topics": len(topics),
            "topic_names": topics,
            "partitions": partition_count
        }

    except Exception as error:
        return {
            "status": "Disconnected",
            "brokers": [],
            "topics": 0,
            "topic_names": [],
            "partitions": 0,
            "error": str(error)
        }