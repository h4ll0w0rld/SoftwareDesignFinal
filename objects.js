"use strict";
class CarSharing {
    user;
    car;
    static carSharingInstance = new CarSharing;
    constructor() {
    }
    static getCarSharingIni() { return this.carSharingInstance; }
    getUser() { return this.user; }
    getCar() { return this.car; }
    setUser(_user) {
        this.user = _user;
    }
    startApp() {
        this.updateCarList();
        this.updateUserList();
        //Load Cars
        //Erzeugen von Standart Benutzer ? 
    }
    addUser(_user) {
        console.log("user" + _user.userName);
        addData(_user);
    }
    async updateUserList() {
        this.user = await getData("User");
        console.log("User Update");
    }
    async updateCarList() {
        this.car = await getData("Car");
        console.log("Car Update");
    }
    async checkLogin(_userInput) {
        console.log("Checking User...");
        if (!this.user) {
            await this.updateUserList();
        }
        for (let i = 0; i < this.user.length; i++) {
            if (this.user[i].userName == _userInput.userName && this.user[i].password == _userInput.password) {
                return true;
            }
        }
        return false;
    }
    //-------------- returns true for valid input ---------------------------------
    async addAcc(_userInput) {
        if (!this.user) {
            await this.updateUserList();
        }
        //Check with RegEx
        for (let i = 0; i < this.user.length; i++) {
            if (this.user[i].userName == _userInput.userName) {
                return false;
            }
        }
        return true;
    }
    async searchCar(_car) {
        var reg = new RegExp(_car, "gi");
        let foundCars = new Array(this.car.length);
        if (!this.user) {
            await this.updateUserList();
        }
        let e = 0;
        for (let i = 0; i < this.car.length; i++) {
            if (!(this.car[i].modelDescription.search(reg) == -1)) {
                foundCars[e] = this.car[i];
                e++;
            }
        }
        let finalCar = new Array(e);
        for (let i = 0; i < e; i++) {
            finalCar[i] = foundCars[i];
        }
        return finalCar;
    }
}
var DriveType;
(function (DriveType) {
    DriveType[DriveType["ELECTRIC"] = 0] = "ELECTRIC";
    DriveType[DriveType["CONVENTIONAL"] = 1] = "CONVENTIONAL";
})(DriveType || (DriveType = {}));
var Role;
(function (Role) {
    Role[Role["USER"] = 0] = "USER";
    Role[Role["LOGGEDINUSER"] = 1] = "LOGGEDINUSER";
    Role[Role["ADMIN"] = 2] = "ADMIN";
})(Role || (Role = {}));
class Car {
    uuid;
    modelDescription;
    driveType;
    earliestUsableTime;
    latestUsageTime;
    maxUseTime;
    flateRate;
    pricePerMinute;
    bookings;
    image;
    //TODO add image string
    constructor(_modelDescription, _driveType, _earliestUsableTime, _latestUsageTime, _maxUseTime, _flateRate, _pricePerMinute) {
        this.modelDescription = _modelDescription;
        this.driveType = _driveType;
        this.earliestUsableTime = _earliestUsableTime;
        this.latestUsageTime = _latestUsageTime;
        this.maxUseTime = _maxUseTime;
        this.flateRate = _flateRate;
        this.pricePerMinute = _pricePerMinute;
        // this.image = _image;
    }
    constructorWithUUID(_uuid, _modelDescription, _driveType, _earliestUsableTime, _latestUsageTime, _maxUseTime, _flateRate, _pricePerMinute) {
        this.modelDescription = _modelDescription;
        this.driveType = _driveType;
        this.earliestUsableTime = _earliestUsableTime;
        this.latestUsageTime = _latestUsageTime;
        this.maxUseTime = _maxUseTime;
        this.flateRate = _flateRate;
        this.pricePerMinute = _pricePerMinute;
        // this.image = _image;
    }
    isFree(_date) {
        if (this.bookings) {
            let newBooking = new Array(this.bookings.length);
            for (let i = 0; i < newBooking.length; i++) {
                if (i < newBooking.length)
                    newBooking[i] = this.bookings[i];
                else
                    newBooking[i] = _date;
            }
            this.bookings = newBooking;
            return false;
        }
        else {
            this.bookings = new Array(_date);
        }
        return true;
    }
    bookCar(_date) {
        if (this.bookings) {
            let newBooking = new Array(this.bookings.length);
            for (let i = 0; i < newBooking.length; i++) {
                if (i < newBooking.length)
                    newBooking[i] = this.bookings[i];
                else
                    newBooking[i] = _date;
            }
            this.bookings = newBooking;
        }
        else
            this.bookings = new Array(_date);
        CarSharing.getCarSharingIni().updateCarList;
    }
}
class Drive {
    dateOfBooking;
    duration;
    car;
}
class DrivingData {
    planedDrive;
    pastDrive;
}
class User {
    role;
    constructor() {
        this.role = Role.USER;
    }
    static async login(_user) {
        let carShare = CarSharing.getCarSharingIni();
        if (await carShare.checkLogin(_user)) {
            sessionStorage.setItem("user", JSON.stringify(_user));
            console.log("Login succesful");
            showLogin();
        }
    }
    static async register(_user) {
        let carShare = CarSharing.getCarSharingIni();
        if (await carShare.addAcc(_user)) {
            carShare.addUser(_user);
            console.log("Login succsesful ! ");
        }
        else
            console.log("User allready exists");
        //
    }
}
class LoggedInUser extends User {
    userName;
    password;
    drivingData;
    constructor(_userName, _password) {
        super();
        this.role = Role.LOGGEDINUSER;
        this.userName = _userName;
        this.password = _password;
    }
    checkLoginData() {
    }
    bookCar() {
    }
    showPastDrive() {
    }
    showPlanedDrives() {
    }
}
class Admin extends LoggedInUser {
    constructor(_userName, _password) {
        super(_userName, _password);
        this.role = Role.ADMIN;
    }
    addCar() {
    }
}
//# sourceMappingURL=objects.js.map