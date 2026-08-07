import random
from datetime import datetime

def generate_event():

    return {

        "truck_id": f"TRUCK-{random.randint(1,50000)}",

        "temperature": round(random.uniform(-5,45),2),

        "speed": random.randint(0,120),

        "fuel": random.randint(10,100),

        "timestamp": datetime.utcnow().isoformat()
    }