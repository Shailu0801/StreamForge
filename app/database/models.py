from sqlalchemy import Column, Integer, String, Float
from app.database.database import Base


class Event(Base):

    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    truck_id = Column(String)

    temperature = Column(Float)

    fuel = Column(Integer)

    speed = Column(Integer)

    location = Column(String)