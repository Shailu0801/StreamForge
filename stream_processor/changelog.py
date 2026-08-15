import json

from confluent_kafka import Producer

from stream_processor.config import BOOTSTRAP_SERVERS


CHANGELOG_TOPIC = "streamforge_state_changelog"


producer = Producer({
    "bootstrap.servers": BOOTSTRAP_SERVERS
})


def publish_state(key, state):
    payload = {
        "key": key,
        "state": state
    }

    producer.produce(
        CHANGELOG_TOPIC,
        key=key,
        value=json.dumps(payload)
    )

    producer.flush()