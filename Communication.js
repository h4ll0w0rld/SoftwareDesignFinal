"use strict";
const refUrl = "http://localhost:7000";
async function addData(_data) {
    console.log("yeaaa");
    let query = new URLSearchParams(_data);
    let url = refUrl;
    if (_data instanceof User)
        url += "/saveUser";
    if (_data instanceof Car)
        url += "/saveCar";
    url += "?" + query;
    console.log(url);
    await fetch(url, { method: "get" });
    console.log("Data has bin transmitted");
}
async function getData(_dataType) {
    let url = refUrl;
    if (_dataType == "User")
        url += "/getUser";
    else if (_dataType == "Car")
        url += "/getCar";
    let response = await (await fetch(url, { method: "get" })).text();
    let userData;
    let carData;
    if (_dataType == "User") {
        userData = JSON.parse(response);
    }
    if (_dataType == "Car") {
        console.log("getting asked");
        carData = JSON.parse(response);
    }
    return userData || carData;
}
//# sourceMappingURL=Communication.js.map