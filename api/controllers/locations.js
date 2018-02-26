'use strict';
var MongoClient = require("mongodb").MongoClient;
const earthRadius = 6371.210; // km
const dbName = "locationsdb";
const colletionName = "locations";

Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

Math.degrees = function (radians) {
    return radians * 180 / Math.PI;
};

function actWithDB(action) {
    MongoClient.connect("mongodb://locations.mongodb:27017/", function (err, client) {
        if (err) {
            console.log(err);
            return;
        }
        const db = client.db(dbName);
        db.createCollection(
            colletionName,
            function (err, collection) {
                console.log("Collection '" + colletionName + "' was " + (err ? "not " : "") + " created");
                if (err) {
                    console.log(err)
                    return undefined;
                }

                var result;
                try {
                    result = action(collection);
                } catch (error) {
                    console.log(error)
                }
                client.close();
            }
        );
    });
}

module.exports = {
    getDistance: getDistance,
    getHistory: getHistory
};

function getDistance(req, res) {
    var from = req.swagger.params.points.value.from;
    var to = req.swagger.params.points.value.to;
    var rLat = Math.radians(to.lat - from.lat);
    var rLon = Math.radians(to.lon - from.lon);
    var a = Math.sin(rLat / 2) * Math.sin(rLat / 2) + Math.cos(Math.radians(from.lat))
        * Math.cos(Math.radians(to.lat)) * Math.sin(rLon / 2) * Math.sin(rLon / 2);

    var distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * earthRadius;

    actWithDB(function (collection) {
        var history = { from: from, to: to, distance: distance }
        collection.insertOne(history, function (err, result) {
            if (err) {
                res.status(500).json();
            } else {
                res.json({ message: "Distance is " + distance + "km." });
            }
        });
    });
}


function getHistory(req, res) {
    actWithDB(function (collection) {
        collection.find().sort({ _id: -1 }).toArray(function (err, result) {
            if (err) {
                res.status(500).json();
            } else {
                res.json(result);
            }
        });
    });
}