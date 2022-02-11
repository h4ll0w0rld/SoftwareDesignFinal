

const refUrl: string = "http://localhost:7000";

async function addData(_data: User | Car): Promise<void> {
    console.log("yeaaa")

    let query: URLSearchParams = new URLSearchParams(<any>_data);
    let url:string = refUrl;
    if (_data instanceof User) url += "/saveUser";
    if (_data instanceof Car) url += "/saveCar";

    url += "?" + query;
    console.log(url);
    await fetch(url, { method: "get" },);

    console.log("Data has bin transmitted");


}



async function updateCarDB(_car:Car){

    let query: URLSearchParams = new URLSearchParams(<any>_car);

    let url:string = refUrl + "/updateOne" + "?"+_car.uuid +"&"+query;

    await fetch(url, {method:"get"});



}

async function saveBooking(_booking:IBooking) {
    let query: URLSearchParams = new URLSearchParams(<any>_booking)
    let url = refUrl +"/saveBooking"+"?"+query;

    await fetch(url, {method:"get"});
    
}





async function getData(_dataType: string): Promise<LoggedInUser[] | Car[]> {

    let url = refUrl;
    if (_dataType == "User") url += "/getUser";
    else if (_dataType == "Car") url += "/getCar";

    let response: string = await (await fetch(url, { method: "get" })).text();

    let userData: LoggedInUser[]
    let finalCar: Car[];
    let carData: ICarDAO[];

    if (_dataType == "User") {
        userData = JSON.parse(response);
    }
    if (_dataType == "Car") {
        console.log("getting asked");

        carData = JSON.parse(response);

        finalCar = new Array(carData.length);

        for (let i: number = 0; i < carData.length; i++) {
            finalCar[i] = new Car(carData[i]._id, carData[i].modelDescription, carData[i].driveType, carData[i].earliestUsableTime, carData[i].latestUsageTime, carData[i].maxUseTime, carData[i].flateRate, carData[i].pricePerMinute, carData[i].image);
        }

    }

    return userData || finalCar;


}



