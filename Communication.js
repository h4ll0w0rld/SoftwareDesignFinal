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
async function updateCarDB(_car) {
    let query = new URLSearchParams(_car);
    let url = refUrl + "/updateOne" + "?" + _car.uuid + "&" + query;
    await fetch(url, { method: "get" });
}
async function saveBooking(_booking) {
    let query = new URLSearchParams(_booking);
    let url = refUrl + "/saveBooking" + "?" + query;
    await fetch(url, { method: "get" });
}
async function getBooking() {
    let url = refUrl + "/getBooking";
    let response = await (await fetch(url, { method: "get" })).text();
    let bookings = JSON.parse(response);
    // console.log(bookings[0].begin)
    return bookings;
}
async function getData(_dataType) {
    let url = refUrl;
    if (_dataType == "User")
        url += "/getUser";
    else if (_dataType == "Car")
        url += "/getCar";
    let response = await (await fetch(url, { method: "get" })).text();
    let userData;
    let finalCar;
    let carData;
    if (_dataType == "User") {
        userData = JSON.parse(response);
    }
    if (_dataType == "Car") {
        console.log("getting asked");
        carData = JSON.parse(response);
        finalCar = new Array(carData.length);
        for (let i = 0; i < carData.length; i++) {
            finalCar[i] = new Car(carData[i]._id, carData[i].modelDescription, carData[i].driveType, carData[i].earliestUsableTime, carData[i].latestUsageTime, carData[i].maxUseTime, carData[i].flateRate, carData[i].pricePerMinute, carData[i].image);
        }
    }
    return userData || finalCar;
}
//# sourceMappingURL=Communication.js.map