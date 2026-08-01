import json
truck =[
    {
        "truck_id" : "TRK001",
        "temperature" : 7.5,
        "city" : "Delhi",
        "timestamp": "2026-07-30T10:29:00Z",
        "active" : True
    },
    {
        "truck_id": "TRK-001",
        "temperature": 9.2,
        "city": "Delhi",
        "timestamp": "2026-07-30T10:30:00Z",
        "active" : True
    },
    {
        "truck_id": "TRK-002",
        "temperature": 9.2,
        "city": "Mumbai",
        "timestamp": "2026-07-30T10:31:00Z",
        "active" : True
    },
    {
        "truck_id": "TRK-003",
        "temperature": 9.2,
        "city": "Bengaluru",
        "timestamp": "2026-07-30T10:32:00Z",
        "active" : False
    }
]    




with open("truck.json","w") as f:
    json.dump(truck,f,indent=4)

with open("truck.json","r") as f:
    truck_data = json.load(f)

for event in truck_data:
    truck_id = event.get("truck_id","unknown")
    try:
        truck_id = event["truck_id"]
        temperature = event["temperature"]
        print(f"{truck_id} | {temperature} C")

    except KeyError as error:
        print("Invalid truck event, missing:",error,"for id",truck_id)