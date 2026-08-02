import json


def get_status(temperature, active):
    if not active:
        return "inactive"
    if temperature<8:
        return "normal"
    elif temperature <=10:
        return "warning"
    else:
        return "critical"

with open("sample_test.json","r") as f:
    truck_data = json.load(f)


processed_events = []
for event in truck_data:
    truck_id = event.get("truck_id","unknown")
    try:
        if truck_id == "unknown":
            raise KeyError("truck_id")
        temperature = event["temperature"]
        active = event["active"]

        if not isinstance(temperature,(int,float)):
            raise ValueError("temperature must be a number")
        
        status = get_status(temperature,active)

        processed_event = {
            "truck_id": truck_id,
            "temperature": temperature,
            "city": event.get("city","unknown"),
            "timestamp": event.get("timestamp","unknown"),
            "status": status
        }
        processed_events.append(processed_event)
        print(f"{truck_id} | {temperature}°C | {status}")

    except KeyError as error:
        print("Invalid truck event, missing:",error,"for id",truck_id)

    except ValueError as error:
        print(f"Invalid truck event for id {truck_id}:{error}")

temperature_by_truck = {}
for event in processed_events:
    if event["status"] == "inactive":
        continue

    truck_id = event["truck_id"]
    temperature = event["temperature"]

    if truck_id not in temperature_by_truck:
        temperature_by_truck[truck_id] = []

    temperature_by_truck[truck_id].append(temperature)

print("\n Average temperature per truck:")


for truck_id, temperatures in temperature_by_truck.items():
    average_temperature = sum(temperatures)/len(temperatures) 
    average_status = get_status(average_temperature,True)

    print(
        f"Truck_id: {truck_id} |"
        f"Average {average_temperature:.2f} |"
        f"{average_status}"
    )
