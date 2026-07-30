from pydantic import BaseModel

class Event(BaseModel):
    truck_id: str
    temperature: float
    fuel: int
    speed: int
    location: str