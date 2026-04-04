## /api/ambulances/seed - (dummy data seeding)
response: {
  "msg": "ambulances seeded"
}
## /api/ambulances :
response:
[
  {
    "id": "cmniprfmg00001wv5dws5ra0l",
    "lat": 28.7041,
    "lng": 77.1025,
    "status": "AVAILABLE",
    "zoneId": null,
    "createdAt": "2026-04-03T09:41:05.368Z",
    "updatedAt": "2026-04-03T09:41:05.368Z"
  },
  {
    "id": "cmniprfng00011wv573egprod",
    "lat": 28.5355,
    "lng": 77.391,
    "status": "AVAILABLE",
    "zoneId": null,
    "createdAt": "2026-04-03T09:41:05.404Z",
    "updatedAt": "2026-04-03T09:41:05.404Z"
  },
  {
    "id": "cmniprfnh00021wv58l7d4zbc",
    "lat": 28.4595,
    "lng": 77.0266,
    "status": "AVAILABLE",
    "zoneId": null,
    "createdAt": "2026-04-03T09:41:05.405Z",
    "updatedAt": "2026-04-03T09:41:05.405Z"
  },
  {
    "id": "cmniprfni00031wv5j959739a",
    "lat": 28.6692,
    "lng": 77.4538,
    "status": "AVAILABLE",
    "zoneId": null,
    "createdAt": "2026-04-03T09:41:05.406Z",
    "updatedAt": "2026-04-03T09:41:05.406Z"
  },
  {
    "id": "cmniprfni00041wv5oslv43py",
    "lat": 28.4089,
    "lng": 77.3178,
    "status": "AVAILABLE",
    "zoneId": null,
    "createdAt": "2026-04-03T09:41:05.406Z",
    "updatedAt": "2026-04-03T09:41:05.406Z"
  }
]

## /api/ambulances/move : (simulates ambulance movement)

curl request - 
curl -X POST http://localhost:3000/api/ambulances/move \
-H "Content-Type: application/json" \
-d '{
  "id": "cmniprfmg00001wv5dws5ra0l",
  "lat": 28.70,
  "lng": 77.10
}'

response: 
{
    "id":"cmniprfmg00001wv5dws5ra0l",
    "lat":28.7,"lng":77.1,
    "status":"AVAILABLE",
    "zoneId":null,
    "createdAt":"2026-04-03T09:41:05.368Z",
    "updatedAt":"2026-04-03T15:00:25.829Z"
    
}


# ALLOCATION ENGINE

## Each hotspot → 1 nearest ambulance

### API - POST /api/allocation/run (Get all hotspots, Get available ambulances, For each hotspot:
### find nearest ambulance -> assign it -> Mark ambulance → MOVING)

utils/distance.ts - distance calculation - calculates the straight-line distance (in km) between two points on Earth given their latitude/longitude coordinates(uses the Haversine formula)

curl -X POST http://localhost:3000/api/allocation/run

response:
[
    {"ambulanceId":"cmniprfmg00001wv5dws5ra0l","hotspot":"Rohini","distance":0},{"ambulanceId":"cmniprfni00041wv5oslv43py","hotspot":"Saket","distance":15.337568422700196}
]

We prioritize hotspots by risk, then greedily assign the nearest available ambulance to each hotspot using distance calculation, ensuring no ambulance is reused.