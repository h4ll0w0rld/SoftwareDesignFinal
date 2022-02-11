import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";
import { ObjectID } from "bson";



let mongoCollection: Mongo.Collection;
let dataBaseUrl: string = "mongodb+srv://admin:hallodasistmeincluster@cluster0.0enhn.mongodb.net/CarShare?retryWrites=true&w=majority";


let port: number = Number(process.env.PORT);

if (!port) port = 7000;

console.log("Running on Port: " + port);


startServer(port);

function startServer(_port: number): void {
    let server: Http.Server = Http.createServer();
    server.addListener("request", handleRequest);
    server.listen(port);


}


function handleListen() {

}



async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse) {

    console.log("I can here you ! :)");

    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");

    let refUrl: URL = new URL(_request.url, "http://localhost");
    let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);



    if (refUrl.pathname == "/saveUser") {


        console.log("Saving new User....");

        await connectRoDatabase(dataBaseUrl, "User");
        mongoCollection.insertOne(url.query);
        _response.end();

    } else if (refUrl.pathname == "/saveCar") {


        console.log("Saving new Car....");

        await connectRoDatabase(dataBaseUrl, "Car");
        mongoCollection.insertOne(url.query);
        _response.end();
    }else if (refUrl.pathname == "/getUser") {


        console.log("searching for User...");
        await connectRoDatabase(dataBaseUrl, "User");

        _response.write(JSON.stringify(await (mongoCollection.find().toArray())));
        _response.end();




    }else if(refUrl.pathname == "/getCar"){
        console.log("searching for Cars...");
        await connectRoDatabase(dataBaseUrl, "Car");

        _response.write(JSON.stringify(await (mongoCollection.find().toArray())));
        _response.end();



    }else if(refUrl.pathname == "/updateOne"){

        console.log("updating....");
        let id:string = refUrl.searchParams.get("uuid");
        var objectId:ObjectID = new ObjectID(id); 
        await connectRoDatabase(dataBaseUrl, "Car");
        mongoCollection.updateOne({"_id":objectId},{$set: url.query});

     
        
           

    }else if(refUrl.pathname == "/saveBooking"){

        await connectRoDatabase(dataBaseUrl, "Bookings");
        mongoCollection.insertOne(url.query);
        _response.end();


    }



}


async function connectRoDatabase(_url: string, _database: string): Promise<void> {

    let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url);

    await mongoClient.connect();
    mongoCollection = mongoClient.db("CarShare").collection(_database);
    console.log("Database is connected", mongoCollection != undefined);

    console.log(_database);


}




