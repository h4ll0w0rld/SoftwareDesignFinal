const refUrl: string = "http://localhost:7000";

async function addData(_data: User | Car): Promise<void> {
    console.log("yeaaa")
    
    let query: URLSearchParams = new URLSearchParams(<any>_data);
    let url = refUrl;
    if (_data instanceof User) url +=  "/saveUser";
    if (_data instanceof Car) url +=  "/saveCar";
    
    url += "?" + query;
    console.log(url);
    await fetch(url, { method: "get" },);

    console.log("Data has bin transmitted");


}





async function getData(_dataType: string): Promise<LoggedInUser[] | Car[]> {

    let url = refUrl;
    if (_dataType == "User") url += "/getUser";
    else if (_dataType == "Car") url += "/getCar";

    let response: string = await (await fetch(url, { method: "get" })).text();

    let userData: LoggedInUser[]
    let carData:Car[];
    
    if(_dataType =="User"){
    userData = JSON.parse(response);
    }
    if(_dataType == "Car"){
        console.log("getting asked");
        carData = JSON.parse(response);
  
    }

    return userData || carData;


}



