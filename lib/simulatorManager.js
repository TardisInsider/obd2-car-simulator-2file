var Simulator = require('./carSimulator.js');
var math = require("math");
var Chance = require('chance');
var HashMap = require('hashmap');
var fs = require('fs');
var constants = require('./constants.js');
var json2csv = require('json2csv').parse;

var mySeed = math.random();
var chance = new Chance(mySeed);

//var Client = require("ibmiotf");
var uuid = require('node-uuid');

var deviceType = "Simulated-Car";
var userSimulators = new HashMap();
var connected;
var self;

var availableCars = {
    manufacturers: [{
        manufacturer: "BMW",
        models: [
            "3er",
            "7er",
            "M6",
            "Z4"
        ]
    }]
};

var SimulatorManager = function() {
 self = this;
};

SimulatorManager.prototype.start = function() {
  console.log("Starting SimulatorManager");
  connected = 0;
  // handle the connection
    connected++;
    if (connected == 1) {
    }
}


// add a simulated Car
SimulatorManager.prototype.addSimCar = function(track, airbagChance, deviceId, fileType) {
     var track = track;
     var airbagChance = airbagChance;
     console.log("Add Sim Car with track " + track + " and airbag chance of " + airbagChance);
     if (track == null) {
     throw ("Track is Required");
     }
     if (airbagChance == null) {
          airbagChance = 0;
     }
     if (airbagChance > 100) {
          airbagChance = 100;
     }
     var type = "User-Simulated-Car";
     if (deviceId == null) {
          deviceId = uuid.v4();
     }
     var serialNumber = uuid.v4();
     var selectedManufactrurer = chance.integer({
          min: 0,
          max: availableCars.manufacturers.length - 1
     })
     var manufacturer = availableCars.manufacturers[selectedManufactrurer].manufacturer;
     var selectedModel = chance.integer({
          min: 0,
          max: availableCars.manufacturers[selectedManufactrurer].models.length - 1
     })
     var model = availableCars.manufacturers[selectedManufactrurer].models[selectedModel];
     var fwVersion = "1.0.0";
     var hwVersion = "1.0.0";
     var devInfo = {
          "serialNumber": serialNumber,
          "manufacturer": manufacturer,
          "model": model,
          "fwVersion": fwVersion,
          "hwVersion": hwVersion
     };
     console.log("register new device " + deviceId);
     self.addSimulator(deviceId, type, track, airbagChance, fileType);
}

SimulatorManager.prototype.flatten = function(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}
/*
Info:
"id","vin","location.lat","location.lon","location.heading","location.speed","location.dilution","pid.EXT_BATT_VOLTAGE.unit","pid.EXT_BATT_VOLTAGE.value","pid.OBD_MILEAGE_METERS.unit","pid.OBD_MILEAGE_METERS.value","pid.DTC_MIL.unit","pid.DTC_MIL.value","pid.DTC_NUMBER.unit","pid.DTC_NUMBER.value","pid.DTC_LIST.unit","pid.DTC_LIST.value","pid.OBD_SPEED.unit","pid.OBD_FUEL.unit","pid.OBD_FUEL.value","pid.DASHBOARD_FUEL_LEVEL.unit","pid.DASHBOARD_FUEL_LEVEL.value","pid.OBD_RPM.unit","pid.OBD_RPM.value","pid.OBD_ENGINE_RUNTIME.unit","pid.OBD_ENGINE_RUNTIME.value","pid.OBD_AMBIENT_AIR_TEMPERATURE.unit","pid.OBD_AMBIENT_AIR_TEMPERATURE.value","pid.OBD_ENGINE_COOLANT_TEMPERATURE.unit","pid.OBD_ENGINE_COOLANT_TEMPERATURE.value","pid.OBD_OUT_TEMPERATURE.unit","pid.OBD_OUT_TEMPERATURE.value","recorded_at"

Location:
"id","location.lat","location.lon","location.heading","location.speed"
*/
// write data to file. the data comes in as JSON, if format is
SimulatorManager.prototype.saveMessageToFile = function(data, fileName, fileType) {
     var message = "";
     var filename = fileName;
     if (fileType == "JSON") {
          message = JSON.stringify(data) + "\n";
          filename = fileName + ".json";
     }
     if (fileType == "CSV") {
          message = json2csv(this.flatten(data), {"header":false}) + "\n";
          filename = fileName + ".csv";
     }
     fs.appendFile(filename, message, function (err) {
                        if (err)
        console.log(err);
                        else
        console.log('Append operation complete.');
   });
}

SimulatorManager.prototype.addSimulator = function(deviceId, type, track, airbagChance, fileType) {
    userSimulators.set(deviceId, new Simulator(deviceId, false, './tracks/' + track, airbagChance));
    userSimulators.get(deviceId).on('CarInformation', function(data) {
          // publish
          self.saveMessageToFile(data, constants.VEHICLE_INFO, fileType);
          console.log("[" + deviceId + "] CarInformation emitted.".green);
          //console.log(JSON.stringify(data));
    });
    userSimulators.get(deviceId).on('Airbag', function(data) {
          // publish
          self.saveMessageToFile(data, constants.VEHICLE_ALERT, fileType);
          console.log("[" + deviceId + "] Airbag data emitted.".green);
    });
    userSimulators.get(deviceId).on('Telemetry', function(data) {
          // publish
          self.saveMessageToFile(data, constants.VEHICLE_LOCATION, fileType);
          console.log("[" + deviceId + "] Telemetry data emitted.".green);
    });
};

// Simulate all devices of type 'Simulated-Car'
SimulatorManager.prototype.simulateDevices = function() {
          console.log("Begin loading up devices of type '"+ deviceType + "'".yellow);
          console.log("Finished loading up devices of type 'Simulated-Car'".yellow);
};

module.exports = SimulatorManager;
