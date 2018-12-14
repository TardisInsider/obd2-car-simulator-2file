# obd2-car-simulator-2file

An application which simulates the output of an OBD2 port and saves output to local files. Three files can be produced - information, location, and alert.

## Usage
Will generate sample data for a number of Vehicles

    node app.js <carCount> <filetype>

    for example -

    node app.js 5 JSON

### Parameters
The application takes two required parameter, number of vehicles and file type

#### Car Count

Integer value used to control how many car simulators to create (such as 5 in the example above)

#### File Type

Type of output file, JSON, CSV, or TEXT

* JSON - creates JSON files vehicle-info.json and vehicle-location.json
* CSV - creates comma separated volume files vehicle-info.csv and vehicle-location.csv
* TEXT - not implemented yet

## Samples

#### vehicle-info JSON

```json
{
  "id": "07254670-be47-4ade-ad5a-2e163d667371",
  "vin": "",
  "location": {
    "lat": "43.81142",
    "lon": "7.71682",
    "heading": 110.65303720326227,
    "speed": 56.851940402908824,
    "dilution": null
  },
  "pid": {
    "EXT_BATT_VOLTAGE": {
      "unit": "mV",
      "value": 11664
    },
    "OBD_MILEAGE_METERS": {
      "unit": "m",
      "value": 546541
    },
    "DTC_MIL": {
      "unit": "boolean",
      "value": false
    },
    "DTC_NUMBER": {
      "unit": "integer",
      "value": 0
    },
    "DTC_LIST": {
      "unit": "string",
      "value": "null"
    },
    "OBD_SPEED": {
      "unit": "km/h"
    },
    "OBD_FUEL": {
      "unit": "litre",
      "value": 18.1102
    },
    "DASHBOARD_FUEL_LEVEL": {
      "unit": "litre",
      "value": 17.1217
    },
    "OBD_RPM": {
      "unit": "rpm",
      "value": 2839
    },
    "OBD_ENGINE_RUNTIME": {
      "unit": "seconds",
      "value": 10000
    },
    "OBD_AMBIENT_AIR_TEMPERATURE": {
      "unit": "°C",
      "value": 12.1204
    },
    "OBD_ENGINE_COOLANT_TEMPERATURE": {
      "unit": "°C",
      "value": 78.0828
    },
    "OBD_OUT_TEMPERATURE": {
      "unit": "°C",
      "value": 14.1204
    }
  },
  "recorded_at": 1543688915
}
```

#### vehicle-location JSON

```json
{
  "id": "29c0470d-3ca9-4029-b71a-635d94544692",
  "location": {
    "lat": "55.89655",
    "lon": "-2.9491",
    "heading": 76.73141135288591,
    "speed": 37.86382608723149
  }
}
```

#### vehicle-alert JSON

```json
{
  "id": "b42bea66-4d26-48e4-8b39-c77b3db45c27",
  "error": {
    "recorded_at": 1543693226,
    "error_code": "B0040"
  }
}
```

### Notes

This was cloned fron https://github.com/trahloff/obd2-car-simulator.git

(publishes the information to the IBM Watson IoT Platform)
