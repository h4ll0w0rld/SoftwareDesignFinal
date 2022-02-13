import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";




let user: Mongo.Collection;
let car: Mongo.Collection;
let booking: Mongo.Collection;

let dataBaseUrl: string = "mongodb+srv://admin:hallodasistmeincluster@cluster0.0enhn.mongodb.net/CarShare?retryWrites=true&w=majority";


let port: number = Number(process.env.PORT);

if (!port) port = 7000;

console.log("Running on Port: " + port);


startServer(port);

async function startServer(_port: number):Promise< void> {
    let server: Http.Server = Http.createServer();
    server.addListener("request", handleRequest);
    server.listen(port);
    connectRoDatabase(dataBaseUrl);
    


}


async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse) {

    console.log("I can here you ! :)");

    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");

    let refUrl: URL = new URL(_request.url, "http://localhost");
    let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);



    if (refUrl.pathname == "/saveUser") {

        user.insertOne(url.query);
        _response.end();

    } else if (refUrl.pathname == "/saveCar") {

        car.insertOne(url.query);
        _response.end();

    }else if (refUrl.pathname == "/getUser") {

        _response.write(JSON.stringify(await (user.find().toArray())));
        _response.end();

    }else if(refUrl.pathname == "/getCar"){

        _response.write(JSON.stringify(await (car.find().toArray())));
        _response.end();

    }else if(refUrl.pathname == "/saveBooking"){

        booking.insertOne(url.query);
        _response.end();

    }else if(refUrl.pathname == "/getBooking"){

        _response.write(JSON.stringify(await (booking.find().toArray())));
        _response.end();

    }

}


async function connectRoDatabase(_url: string): Promise<void> {

    let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url);

    await mongoClient.connect();
    user = mongoClient.db("CarShare").collection("User");
    car = mongoClient.db("CarShare").collection("Car");
    booking = mongoClient.db("CarShare").collection("Bookings");
    console.log("User is connected", user != undefined);


}




