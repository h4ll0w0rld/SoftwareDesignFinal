"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
let mongoCollection;
let dataBaseUrl = "mongodb+srv://admin:hallodasistmeincluster@cluster0.0enhn.mongodb.net/CarShare?retryWrites=true&w=majority";
let port = Number(process.env.PORT);
if (!port)
    port = 7000;
console.log("Running on Port: " + port);
startServer(port);
function startServer(_port) {
    let server = Http.createServer();
    server.addListener("request", handleRequest);
    server.listen(port);
}
function handleListen() {
}
async function handleRequest(_request, _response) {
    console.log("I can here you ! :)");
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");
    let refUrl = new URL(_request.url, "http://localhost");
    let url = Url.parse(_request.url, true);
    if (refUrl.pathname == "/saveUser") {
        console.log("Saving new User....");
        await connectRoDatabase(dataBaseUrl, "User");
        mongoCollection.insertOne(url.query);
        _response.end();
    }
    else if (refUrl.pathname == "/saveCar") {
        console.log("Saving new Car....");
        await connectRoDatabase(dataBaseUrl, "Car");
        mongoCollection.insertOne(url.query);
        _response.end();
    }
    else if (refUrl.pathname == "/getUser") {
        console.log("searching for User...");
        await connectRoDatabase(dataBaseUrl, "User");
        _response.write(JSON.stringify(await (mongoCollection.find().toArray())));
        _response.end();
    }
    else if (refUrl.pathname == "/getCar") {
        console.log("searching for Cars...");
        await connectRoDatabase(dataBaseUrl, "Car");
        _response.write(JSON.stringify(await (mongoCollection.find().toArray())));
        _response.end();
    }
}
async function connectRoDatabase(_url, _database) {
    let mongoClient = new Mongo.MongoClient(_url);
    await mongoClient.connect();
    mongoCollection = mongoClient.db("CarShare").collection(_database);
    console.log("Database is connected", mongoCollection != undefined);
    console.log(_database);
}
//# sourceMappingURL=NodeServer.js.map