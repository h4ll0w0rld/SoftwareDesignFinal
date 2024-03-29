"use strict";
const refUrl = "http://localhost:7000";
async function addData(_data) {
    let query = new URLSearchParams(_data);
    let url = refUrl;
    if (_data instanceof User)
        url += "/saveUser";
    if (_data instanceof Car)
        url += "/saveCar";
    url += "?" + query;
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
async function getBookingDB() {
    let url = refUrl + "/getBooking";
    let response = await (await fetch(url, { method: "get" })).text();
    let bookings = JSON.parse(response);
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
        carData = await JSON.parse(response);
        finalCar = new Array(carData.length);
        for (let i = 0; i < carData.length; i++) {
            finalCar[i] = new Car(carData[i]._id, carData[i].modelDescription, carData[i].driveType, carData[i].earliestUseTime, carData[i].lastUseTime, parseFloat(carData[i].maxUseTime), parseFloat(carData[i].flateRate), parseFloat(carData[i].pricePerMin), carData[i].image);
        }
    }
    return userData || finalCar;
}
//# sourceMappingURL=Communication.js.map