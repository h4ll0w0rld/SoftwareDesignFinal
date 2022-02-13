"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
let user;
let car;
let booking;
let dataBaseUrl = "mongodb+srv://admin:hallodasistmeincluster@cluster0.0enhn.mongodb.net/CarShare?retryWrites=true&w=majority";
let port = Number(process.env.PORT);
if (!port)
    port = 7000;
console.log("Running on Port: " + port);
startServer(port);
async function startServer(_port) {
    let server = Http.createServer();
    server.addListener("request", handleRequest);
    server.listen(port);
    connectRoDatabase(dataBaseUrl);
}
async function handleRequest(_request, _response) {
    console.log("I can here you ! :)");
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");
    let refUrl = new URL(_request.url, "http://localhost");
    let url = Url.parse(_request.url, true);
    if (refUrl.pathname == "/saveUser") {
        user.insertOne(url.query);
        _response.end();
    }
    else if (refUrl.pathname == "/saveCar") {
        car.insertOne(url.query);
        _response.end();
    }
    else if (refUrl.pathname == "/getUser") {
        _response.write(JSON.stringify(await (user.find().toArray())));
        _response.end();
    }
    else if (refUrl.pathname == "/getCar") {
        _response.write(JSON.stringify(await (car.find().toArray())));
        _response.end();
    }
    else if (refUrl.pathname == "/saveBooking") {
        booking.insertOne(url.query);
        _response.end();
    }
    else if (refUrl.pathname == "/getBooking") {
        _response.write(JSON.stringify(await (booking.find().toArray())));
        _response.end();
    }
}
async function connectRoDatabase(_url) {
    let mongoClient = new Mongo.MongoClient(_url);
    await mongoClient.connect();
    user = mongoClient.db("CarShare").collection("User");
    car = mongoClient.db("CarShare").collection("Car");
    booking = mongoClient.db("CarShare").collection("Bookings");
    console.log("User is connected", user != undefined);
}
//# sourceMappingURL=NodeServer.js.map